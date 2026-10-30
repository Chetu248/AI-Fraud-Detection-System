"""
Centralized, environment-driven configuration for the AI service.

Previously this service had hardcoded values scattered across files
(e.g. "localhost:9092" in kafka/consumer.py). Everything that should
differ between local dev, Docker, and a real deployment lives here
instead, read from environment variables with sensible local-dev
defaults.
"""

from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AI_SERVICE_", extra="ignore")

    # --- Service metadata ---
    service_name: str = "ai-service"
    model_version: str = "fraud-model-v1"

    # --- Kafka ---
    # In Docker Compose this should be overridden to the Kafka service's
    # name on the shared network (e.g. "kafka:9092") — see
    # INFRASTRUCTURE_TODO.md at the repo root, since no compose file wiring
    # this service up exists yet.
    kafka_bootstrap_servers: str = "localhost:9092"
    kafka_claim_submitted_topic: str = "claim-submitted"
    kafka_consumer_group: str = "ai-fraud-detection-consumer"
    kafka_enabled: bool = False

    # --- Model artifact ---
    # Resolves to ai-services/models/ by default regardless of the
    # working directory the process is started from.
    model_dir: Path = Path(__file__).resolve().parent.parent / "models"
    model_filename: str = "fraud_model.joblib"
    model_metadata_filename: str = "model_metadata.json"

    # --- Risk tiers ---
    # Example thresholds from docs/fraud_detection.md section 5. These are
    # placeholders — real thresholds should be chosen from validation data
    # and business cost analysis, not hardcoded like this in production.
    risk_threshold_medium: float = 0.30
    risk_threshold_high: float = 0.70

    # --- CORS ---
    cors_allow_origins: list[str] = ["*"]

    @property
    def model_path(self) -> Path:
        return self.model_dir / self.model_filename

    @property
    def model_metadata_path(self) -> Path:
        return self.model_dir / self.model_metadata_filename


settings = Settings()
