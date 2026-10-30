"""
Loads the trained fraud model once (docs/ai_service.md section 6:
"the model should normally be loaded once when the service starts
rather than loaded for every request") and serves predictions.
"""

import json
import logging
from dataclasses import dataclass

from app.config import settings
from app.features import FEATURE_ORDER, build_feature_vector, vector_to_row

logger = logging.getLogger(__name__)


@dataclass
class PredictionResult:
    prediction: str
    risk_score: float
    explanation: list[str]


class ModelService:
    """
    Holds the in-memory model + a SHAP explainer. `is_loaded` reflects
    real load state so /health's `modelLoaded` field is honest instead
    of always reporting True per docs/ai_service.md section 5.
    """

    def __init__(self) -> None:
        self._model = None
        self._explainer = None
        self._metadata: dict = {}
        self.is_loaded = False

    def load(self) -> None:
        import joblib

        if not settings.model_path.exists():
            logger.warning(
                "No trained model found at %s. Run `python -m app.ml.train` first. "
                "Predictions will be unavailable until a model exists.",
                settings.model_path,
            )
            return

        self._model = joblib.load(settings.model_path)

        if settings.model_metadata_path.exists():
            self._metadata = json.loads(settings.model_metadata_path.read_text())
        else:
            self._metadata = {"modelVersion": settings.model_version}

        self._explainer = self._build_explainer()
        self.is_loaded = True
        logger.info(
            "Loaded fraud model version=%s type=%s",
            self._metadata.get("modelVersion"),
            self._metadata.get("modelType"),
        )

    def _build_explainer(self):
        """
        SHAP is the explainability approach docs/fraud_detection.md
        section 6 recommends for tree-based models. If it fails to
        build for any reason (e.g. an incompatible model type after a
        future retrain), explanations fall back to a simpler
        feature-importance heuristic in `_explain` rather than the
        whole prediction failing.
        """
        try:
            import shap

            return shap.TreeExplainer(self._model)
        except Exception:  # noqa: BLE001 - explainability must never break /predict
            logger.exception("Could not build SHAP explainer; will use a fallback explanation.")
            return None

    @property
    def model_version(self) -> str:
        return self._metadata.get("modelVersion", settings.model_version)

    def _risk_tier(self, risk_score: float) -> str:
        # Thresholds from docs/fraud_detection.md section 5 — example
        # values only, see the warning in app/config.py.
        if risk_score >= settings.risk_threshold_high:
            return "HIGH_RISK"
        if risk_score >= settings.risk_threshold_medium:
            return "MEDIUM_RISK"
        return "LOW_RISK"

    def _explain(self, feature_vector: dict[str, float], row: list[float]) -> list[str]:
        readable_names = {
            "claim_amount": "claim amount",
            "claim_to_premium_ratio": "claim-to-premium ratio",
            "days_since_policy_start": "time since policy started",
            "previous_claims_count": "number of previous claims",
            "vehicle_age_years": "vehicle age",
            "claims_last_90_days": "claims filed in the last 90 days",
        }

        if self._explainer is not None:
            try:
                shap_values = self._explainer.shap_values([row])
                # Binary XGBoost/RandomForest classifiers can return
                # either a single array or a [class_0, class_1] pair
                # depending on the SHAP/model version — handle both.
                contributions = shap_values[1][0] if isinstance(shap_values, list) else shap_values[0]

                ranked = sorted(
                    zip(FEATURE_ORDER, contributions),
                    key=lambda pair: abs(pair[1]),
                    reverse=True,
                )

                explanation = []
                for name, contribution in ranked[:3]:
                    if abs(contribution) < 1e-4:
                        continue
                    direction = "increased" if contribution > 0 else "decreased"
                    explanation.append(
                        f"{readable_names.get(name, name)} {direction} the risk score "
                        f"(value: {feature_vector[name]:.2f})"
                    )

                if explanation:
                    return explanation
            except Exception:  # noqa: BLE001
                logger.exception("SHAP explanation failed; falling back to feature importances.")

        # Fallback: global feature importances, not per-prediction —
        # clearly weaker, but never leaves the response with no
        # explanation at all.
        try:
            importances = self._model.feature_importances_
            ranked = sorted(zip(FEATURE_ORDER, importances), key=lambda pair: pair[1], reverse=True)
            return [
                f"{readable_names.get(name, name)} is one of the model's most influential factors "
                f"overall (value: {feature_vector[name]:.2f})"
                for name, _ in ranked[:3]
            ]
        except Exception:  # noqa: BLE001
            logger.exception("Fallback explanation also failed.")
            return ["Explanation unavailable for this prediction."]

    def predict(self, claim_amount: float, claim_date, raw_features: dict) -> PredictionResult:
        if not self.is_loaded:
            raise RuntimeError(
                "Fraud model is not loaded. Run `python -m app.ml.train` to generate one."
            )

        feature_vector = build_feature_vector(claim_amount, claim_date, raw_features)
        row = vector_to_row(feature_vector)

        risk_score = float(self._model.predict_proba([row])[0][1])
        prediction = self._risk_tier(risk_score)
        explanation = self._explain(feature_vector, row)

        return PredictionResult(prediction=prediction, risk_score=risk_score, explanation=explanation)


model_service = ModelService()
