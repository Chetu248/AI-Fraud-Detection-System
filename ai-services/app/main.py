import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app import ocr
from app.config import settings
from app.kafka.consumer import start_consumer
from app.ml.model_service import model_service
from app.schemas import DocumentAnalysisResponse, HealthResponse, PredictRequest, PredictResponse

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Model loaded once at startup and kept in memory — docs/ai_service.md
    # section 6 — rather than reloading it on every /predict call.
    model_service.load()

    if settings.kafka_enabled:
        start_consumer()
    else:
        logger.info("Kafka consumer disabled via AI_SERVICE_KAFKA_ENABLED=false.")

    yield


app = FastAPI(
    title="AI Insurance Fraud Detection Service",
    description="AI service for insurance claim fraud detection and analysis.",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_allow_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthResponse)
def health_check():
    return HealthResponse(
        status="UP",
        service=settings.service_name,
        modelLoaded=model_service.is_loaded,
        modelVersion=model_service.model_version,
    )


@app.post("/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    """
    Matches the contract documented in docs/ai_service.md section 4.

    Per docs/ai_service.md section 8, this endpoint only returns a
    prediction, risk score, model version, and explanation — it makes
    no business decision (e.g. whether to open an investigation).
    That threshold logic belongs on the Java side once it calls this
    endpoint (see ClaimEventServiceImpl's TODO comment on the backend
    and INFRASTRUCTURE_TODO.md — that wiring does not exist yet).
    """

    if not model_service.is_loaded:
        # Per docs/ai_service.md section 9: an unavailable model should
        # not lose or corrupt the claim — the caller gets a clear 503
        # so it can mark the analysis as pending/failed and retry,
        # rather than receiving a fabricated prediction.
        raise HTTPException(
            status_code=503,
            detail="Fraud model is not loaded. Run `python -m app.ml.train` to generate one.",
        )

    try:
        result = model_service.predict(
            claim_amount=request.claimAmount,
            claim_date=request.claimDate,
            raw_features=request.features,
        )
    except Exception:
        logger.exception("Prediction failed for claimId=%s", request.claimId)
        raise HTTPException(status_code=500, detail="Prediction failed.") from None

    return PredictResponse(
        claimId=request.claimId,
        prediction=result.prediction,
        riskScore=round(result.risk_score, 4),
        modelVersion=model_service.model_version,
        explanation=result.explanation,
    )


@app.post("/analyze-document", response_model=DocumentAnalysisResponse)
async def analyze_document(file: UploadFile = File(...), claim_amount: float | None = None):
    """
    Best-effort OCR + signal extraction for a single claim document.
    Not part of the documented /predict contract — this is a separate,
    optional endpoint a caller can use to pull document-derived
    signals before folding them into a /predict call's `features`.
    """

    file_bytes = await file.read()

    try:
        text = ocr.extract_text(file.filename or "", file_bytes)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from None
    except RuntimeError as exc:
        raise HTTPException(status_code=503, detail=str(exc)) from None

    signals = ocr.extract_document_signals(text, claim_amount)

    return DocumentAnalysisResponse(
        fileName=file.filename or "unknown",
        extractedText=text,
        wordCount=len(text.split()),
        signals=signals,
    )


# TODO(infra — Docker): there is no Dockerfile for this service yet. When
# adding one, a minimal shape would be:
#
#     FROM python:3.11-slim
#     RUN apt-get update && apt-get install -y --no-install-recommends tesseract-ocr \
#         && rm -rf /var/lib/apt/lists/*
#     WORKDIR /app
#     COPY requirements.txt .
#     RUN pip install --no-cache-dir -r requirements.txt
#     COPY . .
#     RUN python -m app.ml.train
#     CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
#
# (tesseract-ocr is required for /analyze-document's image OCR path —
# PDF extraction works without it.) This service would join the same
# docker-compose.yml as the backend + Postgres + Kafka services (none
# of that compose setup exists in this project yet — see
# INFRASTRUCTURE_TODO.md at the repo root). Config now comes from
# environment variables (AI_SERVICE_*, see app/config.py) rather than
# being hardcoded, so the same image works locally and in Docker.
