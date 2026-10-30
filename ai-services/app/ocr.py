"""
Document text extraction and simple document-derived signals.

docs/fraud_detection.md section 2 lists "document-derived signals" as
a conceptual input to the fraud model. This module extracts real text
from uploaded claim documents (PDFs and images) and derives a small,
honest set of signals from it — it does not attempt to be a full
document-fraud model (that would need its own labeled dataset and
training pipeline, well beyond OCR text extraction).

Image OCR requires the `tesseract` binary to be installed on the host
(see the Dockerfile TODO in app/main.py) — this module fails
gracefully with a clear error if it isn't available rather than
crashing the request.
"""

import io
import logging
import re

logger = logging.getLogger(__name__)

_SUSPICIOUS_KEYWORDS = [
    "duplicate",
    "photocopy",
    "reprint",
    "reissued",
    "unsigned",
]

# Matches amounts like "₹75,000", "Rs. 75000", "75,000.00"
_AMOUNT_PATTERN = re.compile(r"(?:₹|rs\.?|inr)?\s?([\d,]{4,})(?:\.\d{1,2})?", re.IGNORECASE)


def extract_text_from_pdf(file_bytes: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(file_bytes))
    pages_text = [page.extract_text() or "" for page in reader.pages]
    return "\n".join(pages_text).strip()


def extract_text_from_image(file_bytes: bytes) -> str:
    import pytesseract
    from PIL import Image

    try:
        image = Image.open(io.BytesIO(file_bytes))
        return pytesseract.image_to_string(image).strip()
    except pytesseract.TesseractNotFoundError as exc:
        raise RuntimeError(
            "The tesseract OCR binary is not installed on this host. "
            "Install it (e.g. `apt-get install tesseract-ocr` — see the "
            "Dockerfile TODO in app/main.py) before analyzing image documents."
        ) from exc


def extract_text(filename: str, file_bytes: bytes) -> str:
    lower_name = filename.lower()

    if lower_name.endswith(".pdf"):
        return extract_text_from_pdf(file_bytes)

    if lower_name.endswith((".png", ".jpg", ".jpeg", ".bmp", ".tiff")):
        return extract_text_from_image(file_bytes)

    raise ValueError(f"Unsupported document type for OCR: {filename}")


def _extract_amounts(text: str) -> list[float]:
    amounts = []

    for match in _AMOUNT_PATTERN.finditer(text):
        digits = match.group(1).replace(",", "")

        if not digits.isdigit():
            continue

        value = float(digits)

        # Ignore short numbers that are almost certainly not currency
        # amounts (dates, phone-number fragments, document IDs).
        if value >= 1000:
            amounts.append(value)

    return amounts


def extract_document_signals(text: str, claim_amount: float | None = None) -> list[str]:
    """
    Derives a short list of plain-language, honest signals from OCR'd
    text. These are informational hints for a human investigator, not
    a fraud verdict — consistent with docs/fraud_detection.md section
    10's human-in-the-loop design.
    """

    signals: list[str] = []
    lower_text = text.lower()

    for keyword in _SUSPICIOUS_KEYWORDS:
        if keyword in lower_text:
            signals.append(f"Document contains the word '{keyword}'.")

    if claim_amount is not None:
        amounts_in_document = _extract_amounts(text)

        if amounts_in_document:
            closest = min(amounts_in_document, key=lambda amount: abs(amount - claim_amount))
            difference_ratio = abs(closest - claim_amount) / max(claim_amount, 1)

            if difference_ratio > 0.15:
                signals.append(
                    f"The closest amount found in the document (₹{closest:,.0f}) "
                    f"differs from the claimed amount (₹{claim_amount:,.0f}) by "
                    f"more than 15%."
                )
        else:
            signals.append("No monetary amount could be detected in the document text.")

    if len(text.split()) < 20:
        signals.append("Document contains very little extractable text — it may be low quality or blank.")

    return signals
