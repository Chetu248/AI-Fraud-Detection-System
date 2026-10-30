"""
Feature engineering for the fraud-risk model.

docs/fraud_detection.md section 3 states the important rule this
module exists to enforce:

    "The feature-processing logic used during inference must match
    the logic used during model training."

app/ml/train.py and app/ml/model_service.py both import
`FEATURE_ORDER` and `build_feature_vector` from this module rather
than each re-implementing the transformation, so there is exactly one
place this logic can drift.
"""

import logging
from datetime import datetime
from typing import Union

logger = logging.getLogger(__name__)

# The order the model was trained on. Changing this list requires
# retraining the model (app/ml/train.py) — it is not just cosmetic.
FEATURE_ORDER: list[str] = [
    "claim_amount",
    "claim_to_premium_ratio",
    "days_since_policy_start",
    "previous_claims_count",
    "vehicle_age_years",
    "claims_last_90_days",
]

# Conservative fallback values used when the caller doesn't supply a
# raw signal. These intentionally sit at the "unremarkable" end of
# each distribution so a missing field nudges the risk score down
# rather than up — the model should not penalize incomplete input.
_DEFAULTS: dict[str, float] = {
    "premiumAmount": 25_000.0,
    "policyStartDate": None,  # handled specially below
    "previousClaimsCount": 0.0,
    "vehicleManufactureYear": None,  # handled specially below
    "claimsLast90Days": 0.0,
}


def _coerce_float(value: Union[float, str, None], field_name: str) -> Union[float, None]:
    if value is None:
        return None

    try:
        return float(value)
    except (TypeError, ValueError):
        logger.warning("Could not parse feature '%s'=%r as a number; ignoring it.", field_name, value)
        return None


def _parse_date(value: Union[str, None]) -> Union[datetime, None]:
    if not value:
        return None

    try:
        return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        logger.warning("Could not parse date feature %r; ignoring it.", value)
        return None


def build_feature_vector(
    claim_amount: float,
    claim_date: datetime,
    raw_features: dict[str, Union[float, str]],
) -> dict[str, float]:
    """
    Turn the raw request payload into the exact numeric feature
    vector the model expects (see FEATURE_ORDER).

    `raw_features` is the free-form `features` dict from PredictRequest.
    Every value is read defensively — a malformed or missing field
    never raises; it falls back to a documented default and a warning
    is logged, per docs/ai_service.md section 7 ("Raw unvalidated input
    should not be sent directly into the model").
    """

    premium_amount = _coerce_float(raw_features.get("premiumAmount"), "premiumAmount")
    if premium_amount is None or premium_amount <= 0:
        premium_amount = _DEFAULTS["premiumAmount"]

    claim_to_premium_ratio = claim_amount / premium_amount if premium_amount else 0.0

    policy_start_date = _parse_date(raw_features.get("policyStartDate"))
    if policy_start_date is not None:
        # Normalize both to naive UTC-ish comparison to avoid tz-aware
        # vs naive subtraction errors from partially-specified input.
        claim_dt = claim_date.replace(tzinfo=None)
        start_dt = policy_start_date.replace(tzinfo=None)
        days_since_policy_start = max((claim_dt - start_dt).days, 0)
    else:
        # Unknown policy start = treat as an established, unremarkable
        # policy rather than assuming the suspicious "brand new policy"
        # case — see _DEFAULTS comment above.
        days_since_policy_start = 365.0

    previous_claims_count = _coerce_float(
        raw_features.get("previousClaimsCount"), "previousClaimsCount"
    )
    if previous_claims_count is None or previous_claims_count < 0:
        previous_claims_count = _DEFAULTS["previousClaimsCount"]

    vehicle_manufacture_year = _coerce_float(
        raw_features.get("vehicleManufactureYear"), "vehicleManufactureYear"
    )
    if vehicle_manufacture_year:
        vehicle_age_years = max(claim_date.year - vehicle_manufacture_year, 0.0)
    else:
        vehicle_age_years = 5.0  # median-ish, unremarkable

    claims_last_90_days = _coerce_float(
        raw_features.get("claimsLast90Days"), "claimsLast90Days"
    )
    if claims_last_90_days is None or claims_last_90_days < 0:
        claims_last_90_days = _DEFAULTS["claimsLast90Days"]

    return {
        "claim_amount": float(claim_amount),
        "claim_to_premium_ratio": float(claim_to_premium_ratio),
        "days_since_policy_start": float(days_since_policy_start),
        "previous_claims_count": float(previous_claims_count),
        "vehicle_age_years": float(vehicle_age_years),
        "claims_last_90_days": float(claims_last_90_days),
    }


def vector_to_row(feature_vector: dict[str, float]) -> list[float]:
    """Order a feature dict into the exact column order the model expects."""
    return [feature_vector[name] for name in FEATURE_ORDER]
