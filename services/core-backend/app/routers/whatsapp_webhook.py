import hmac
import hashlib
import json
import logging
from fastapi import APIRouter, Request, HTTPException, Query, BackgroundTasks, status
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel

logger = logging.getLogger("secops.webhook")
router = APIRouter(prefix="/api/v1/webhooks/whatsapp", tags=["Webhooks"])

# Environmental Secrets configured via GCP Secret Manager or KMS
META_VERIFY_TOKEN = "your-configured-meta-verify-token"
META_APP_SECRET = "your-meta-app-secret-key-32bytes"

class WebhookResponse(BaseModel):
    status: str
    message: str

# 1. Webhook Handshake Verification (Hub Challenge GET Endpoint)
@router.get("", response_class=PlainTextResponse)
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    if hub_mode == "subscribe" and hub_verify_token == META_VERIFY_TOKEN:
        logger.info("[✓] Meta Webhook Handshake successful. Token matched.")
        return hub_challenge
    
    logger.error("[!] Meta Webhook Handshake mismatch. Invalid verify token submitted.")
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN, 
        detail="Verification token mismatch"
    )

# 2. Inbound Message Receiver (Fast-ACK POST Endpoint)
@router.post("")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    # 1. Read raw body bytes to preserve exact structure for HMAC check
    raw_body = await request.body()
    signature_header = request.headers.get("X-Hub-Signature-256")
    
    if not signature_header:
        logger.warning("[!] Inbound Webhook dropped: Missing X-Hub-Signature-256 header.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Signature header missing"
        )
        
    # Meta Signature format: sha256={digest}
    parts = signature_header.split("=")
    if len(parts) != 2 or parts[0] != "sha256":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Malformed signature signature format"
        )
    received_digest = parts[1]
    
    # 2. Cryptographic signature check to deny spoofing attempts
    expected_digest = hmac.new(
        key=META_APP_SECRET.encode("utf-8"),
        msg=raw_body,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(expected_digest, received_digest):
        logger.error(f"[🚨 SEC_ALERT] Webhook Signature Mismatch! Expected: {expected_digest[:10]}... | Received: {received_digest[:10]}...")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Cryptographic signature verification failed"
        )
    
    # 3. Fast-ACK: Payload deserialized and immediately queued in background task
    try:
        payload = json.loads(raw_body.decode("utf-8"))
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid JSON payload")
        
    # Forward processing strictly to Celery / Background tasks to complete execution under 50ms
    background_tasks.add_task(dispatch_ingestion_job, payload)
    
    return {"status": "accepted", "message": "Enqueued successfully"}

async def dispatch_ingestion_job(payload: dict):
    # Trigger Celery Task inside worker pools asynchronously
    try:
        from app.core.tasks.inbound_processor import process_inbound_payload
        process_inbound_payload.delay(payload)
    except ImportError:
        logger.error("Celery task process_inbound_payload could not be imported.")
