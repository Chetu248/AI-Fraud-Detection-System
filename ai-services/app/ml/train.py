"""
Trains the fraud-risk classifier and saves the model artifact.

IMPORTANT — READ THIS BEFORE TRUSTING ANY PREDICTION FROM THIS MODEL:
There is no real historical claims dataset anywhere in this project.
`generate_synthetic_dataset` below fabricates a labeled dataset from a
hand-written "ground truth" fraud-propensity formula so that there is
*something* trainable end-to-end (feature engineering -> training ->
a real serialized model -> real inference -> real explanations). It
is a stand-in for docs/fraud_detection.md section 7's "Dataset" step,
not a substitute for one. Before this model is used to make any real
decision, it must be retrained on actual historical claims data with
known fraud outcomes.

Run with:
    python -m app.ml.train
"""

import json
import logging
from datetime import datetime, timezone

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    average_precision_score,
    classification_report,
    confusion_matrix,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split

from app.config import settings
from app.features import FEATURE_ORDER

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger(__name__)

try:
    from xgboost import XGBClassifier

    _HAS_XGBOOST = True
except ImportError:  # pragma: no cover - environment-dependent
    _HAS_XGBOOST = False


def _standardize(series: pd.Series) -> pd.Series:
    std = series.std()
    if std == 0 or np.isnan(std):
        return series * 0.0
    return (series - series.mean()) / std


def generate_synthetic_dataset(n_rows: int = 8000, seed: int = 42) -> pd.DataFrame:
    """
    Fabricates a labeled dataset with realistic-looking distributions
    and a hand-crafted (not learned) fraud-propensity formula, so the
    resulting labels are correlated with the features but noisy —
    not perfectly separable. See the module docstring above.
    """

    rng = np.random.default_rng(seed)

    claim_amount = rng.lognormal(mean=10.9, sigma=0.55, size=n_rows)
    premium_amount = rng.lognormal(mean=9.9, sigma=0.4, size=n_rows)
    claim_to_premium_ratio = claim_amount / premium_amount

    days_since_policy_start = rng.gamma(shape=2.0, scale=250.0, size=n_rows)
    previous_claims_count = rng.poisson(lam=0.6, size=n_rows)
    vehicle_age_years = rng.uniform(0, 15, size=n_rows)
    claims_last_90_days = rng.poisson(lam=0.25, size=n_rows)

    df = pd.DataFrame(
        {
            "claim_amount": claim_amount,
            "claim_to_premium_ratio": claim_to_premium_ratio,
            "days_since_policy_start": days_since_policy_start,
            "previous_claims_count": previous_claims_count.astype(float),
            "vehicle_age_years": vehicle_age_years,
            "claims_last_90_days": claims_last_90_days.astype(float),
        }
    )

    # Hand-crafted "ground truth" fraud-propensity logit. Coefficients
    # are illustrative, not derived from any real analysis.
    logit = (
        1.8 * _standardize(df["claim_to_premium_ratio"])
        - 1.4 * _standardize(df["days_since_policy_start"])
        + 1.0 * _standardize(df["previous_claims_count"])
        + 0.9 * _standardize(df["claims_last_90_days"])
        + 0.3 * _standardize(df["claim_amount"])
        - 0.2 * _standardize(df["vehicle_age_years"])
        + rng.normal(0, 1.0, size=n_rows)  # noise so it isn't perfectly separable
        - 3.0  # bias term, tuned so the base fraud rate lands around ~8-10%
    )

    fraud_probability = 1 / (1 + np.exp(-logit))
    df["is_fraud"] = rng.binomial(1, fraud_probability)

    return df


def train_model(df: pd.DataFrame):
    X = df[FEATURE_ORDER]
    y = df["is_fraud"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    fraud_rate = y_train.mean()
    logger.info("Training rows: %d | fraud rate: %.2f%%", len(X_train), fraud_rate * 100)

    if _HAS_XGBOOST:
        # scale_pos_weight addresses the class imbalance called out in
        # docs/fraud_detection.md section 8, rather than relying on
        # raw accuracy against an imbalanced label.
        scale_pos_weight = (1 - fraud_rate) / max(fraud_rate, 1e-6)
        model = XGBClassifier(
            n_estimators=200,
            max_depth=4,
            learning_rate=0.08,
            subsample=0.9,
            colsample_bytree=0.9,
            scale_pos_weight=scale_pos_weight,
            eval_metric="aucpr",
            random_state=42,
        )
        model_type = "xgboost.XGBClassifier"
    else:  # pragma: no cover - environment-dependent
        logger.warning("xgboost not available; falling back to RandomForestClassifier.")
        model = RandomForestClassifier(
            n_estimators=300,
            max_depth=8,
            class_weight="balanced",
            random_state=42,
        )
        model_type = "sklearn.RandomForestClassifier"

    model.fit(X_train, y_train)

    y_proba = model.predict_proba(X_test)[:, 1]
    y_pred = (y_proba >= 0.5).astype(int)

    roc_auc = roc_auc_score(y_test, y_proba)
    pr_auc = average_precision_score(y_test, y_proba)
    report = classification_report(y_test, y_pred, output_dict=True)
    matrix = confusion_matrix(y_test, y_pred).tolist()

    logger.info("ROC-AUC: %.4f | PR-AUC: %.4f", roc_auc, pr_auc)
    logger.info("Confusion matrix (rows=actual, cols=predicted): %s", matrix)

    metrics = {
        "rocAuc": round(float(roc_auc), 4),
        "prAuc": round(float(pr_auc), 4),
        "precision": round(float(report["1"]["precision"]), 4),
        "recall": round(float(report["1"]["recall"]), 4),
        "f1": round(float(report["1"]["f1-score"]), 4),
        "confusionMatrix": matrix,
        "testRows": len(X_test),
        "trainRows": len(X_train),
        "trainFraudRate": round(float(fraud_rate), 4),
    }

    return model, model_type, metrics


def save_artifact(model, model_type: str, metrics: dict) -> None:
    import joblib

    settings.model_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, settings.model_path)

    metadata = {
        "modelVersion": settings.model_version,
        "modelType": model_type,
        "featureOrder": FEATURE_ORDER,
        "trainedAt": datetime.now(timezone.utc).isoformat(),
        "trainingData": "SYNTHETIC — see app/ml/train.py module docstring. Not real claims data.",
        "metrics": metrics,
    }

    settings.model_metadata_path.write_text(json.dumps(metadata, indent=2))

    logger.info("Saved model to %s", settings.model_path)
    logger.info("Saved metadata to %s", settings.model_metadata_path)


def main() -> None:
    logger.info("Generating synthetic training data...")
    df = generate_synthetic_dataset()

    logger.info("Training model...")
    model, model_type, metrics = train_model(df)

    save_artifact(model, model_type, metrics)
    logger.info("Done.")


if __name__ == "__main__":
    main()
