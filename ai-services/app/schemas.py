"""
Request/response schemas for the AI service's public API.

These intentionally mirror the contract documented in
docs/ai_service.md section 4 and docs/fraud_detection.md section 4 —
this is the "source of truth" contract the Java backend would call
once it's wired up (it is not wired up yet; see ClaimEventServiceImpl's
TODO on the Java side and INFRASTRUCTURE_TODO.md for what's missing).
"""

from datetime import datetime
from typing import Optional, Union

from pydantic import BaseModel, Field


class PredictRequest(BaseModel):
    """
    Matches docs/ai_service.md's example request body.

    `features` carries whatever raw signals the caller has available
    (premiumAmount, policyStartDate, previousClaimsCount,
    vehicleManufactureYear, claimsLast90Days, etc.). Fields the caller
    omits fall back to conservative defaults in app/features.py — per
    docs/ai_service.md section 7, missing values must not reach the
    model unvalidated, so every default is applied explicitly and
    logged, never silently guessed by the model itself.
    """

    claimId: int = Field(..., gt=0)
    vehicleId: Optional[int] = Field(default=None, gt=0)
    claimAmount: float = Field(..., ge=0)
    claimDate: datetime
    features: dict[str, Union[float, str]] = Field(default_factory=dict)


class PredictResponse(BaseModel):
    """Matches docs/ai_service.md's example response body exactly."""

    claimId: int
    prediction: str
    riskScore: float
    modelVersion: str
    explanation: list[str]


class HealthResponse(BaseModel):
    """Matches docs/ai_service.md section 5's example, plus `service`
    for backward compatibility with the health check that already
    existed before the model was wired up."""

    status: str
    service: str
    modelLoaded: bool
    modelVersion: str


class DocumentAnalysisResponse(BaseModel):
    """Response for the document OCR / signal-extraction endpoint."""

    fileName: str
    extractedText: str
    wordCount: int
    signals: list[str]
