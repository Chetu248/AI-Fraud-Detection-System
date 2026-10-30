import json
import logging
from datetime import datetime, timezone
from threading import Thread

from kafka import KafkaConsumer

from app.config import settings
from app.ml.model_service import model_service

logger = logging.getLogger(__name__)


def create_consumer() -> KafkaConsumer:
    return KafkaConsumer(
        settings.kafka_claim_submitted_topic,
        bootstrap_servers=settings.kafka_bootstrap_servers,
        group_id=settings.kafka_consumer_group,
        key_deserializer=lambda key: key.decode("utf-8") if key else None,
        value_deserializer=lambda value: json.loads(value.decode("utf-8")),
        auto_offset_reset="latest",
        enable_auto_commit=True,
    )


def _handle_claim_submitted(event: dict) -> None:
    """
    Runs the fraud-detection pipeline for one ClaimSubmittedEvent.

    IMPORTANT — KNOWN GAP: ClaimSubmittedEvent (see backend/.../event/
    ClaimSubmittedEvent.java) only carries {claimId, vehicleId,
    submittedAt}. It has no claimAmount, premium, policy dates, or
    prior-claims history, so this handler cannot build a real feature
    vector from the event alone. Getting the full claim record would
    require either:
      (a) the backend enriching this event with more fields, or
      (b) this service calling an authenticated backend endpoint to
          fetch the claim (no such service-to-service/internal auth
          exists yet — /claims/{id} requires a customer-scoped JWT).
    Neither is a change this service can make on its own (backend
    changes are out of scope here — see INFRASTRUCTURE_TODO.md).

    Until one of those exists, this only demonstrates that the wiring
    works end-to-end using conservative defaults for everything the
    event doesn't carry — real risk scores require real inputs.
    """

    if not model_service.is_loaded:
        logger.warning(
            "Skipping fraud analysis for claimId=%s: model is not loaded.",
            event.get("claimId"),
        )
        return

    claim_id = event.get("claimId")
    submitted_at = event.get("submittedAt")

    try:
        claim_date = datetime.fromisoformat(submitted_at) if submitted_at else datetime.now(timezone.utc)
    except ValueError:
        claim_date = datetime.now(timezone.utc)

    try:
        result = model_service.predict(
            claim_amount=0.0,  # not present on this event — see docstring above
            claim_date=claim_date,
            raw_features={},  # not present on this event — see docstring above
        )
    except Exception:
        logger.exception("Fraud analysis failed for claimId=%s", claim_id)
        return

    logger.info(
        "[PLACEHOLDER ANALYSIS] claimId=%s prediction=%s riskScore=%.4f "
        "(built from defaults only — see _handle_claim_submitted docstring). "
        "Not persisted anywhere: no backend endpoint exists yet to store this result.",
        claim_id,
        result.prediction,
        result.risk_score,
    )


def consume_claim_events() -> None:
    logger.info("Starting AI Kafka consumer...")

    consumer = create_consumer()

    logger.info(
        "Listening to Kafka topic '%s' with group '%s'",
        settings.kafka_claim_submitted_topic,
        settings.kafka_consumer_group,
    )

    try:
        for message in consumer:
            logger.info(
                "Received ClaimSubmittedEvent: key=%s value=%s",
                message.key,
                message.value,
            )

            _handle_claim_submitted(message.value)

    except Exception:
        logger.exception("Kafka consumer stopped because of an error.")

    finally:
        consumer.close()
        logger.info("Kafka consumer closed.")


def start_consumer() -> Thread:
    consumer_thread = Thread(
        target=consume_claim_events,
        name="kafka-consumer-thread",
        daemon=True,
    )

    consumer_thread.start()

    return consumer_thread
