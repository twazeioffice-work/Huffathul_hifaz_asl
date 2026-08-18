# Location: services/core-backend/app/routers/whatsapp_webhook.py
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, Query, BackgroundTasks, status
from fastapi.responses import PlainTextResponse
from app.core.tasks.inbound_processor import process_inbound_payload

router = APIRouter(prefix="/api/v1/webhooks/whatsapp")

META_VERIFY_TOKEN = "your-configured-meta-verify-token"
META_APP_SECRET = "your-meta-app-secret"

@router.get("", response_class=PlainTextResponse)
async def verify_webhook(
    hub_mode: str = Query(None, alias="hub.mode"),
    hub_verify_token: str = Query(None, alias="hub.verify_token"),
    hub_challenge: str = Query(None, alias="hub.challenge")
):
    if hub_mode == "subscribe" and hub_verify_token == META_VERIFY_TOKEN:
        return hub_challenge
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Verification token mismatch")

@router.post("")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    # 1. Read raw body bytes for HMAC verification
    raw_body = await request.body()
    signature_header = request.headers.get("X-Hub-Signature-256")
    
    if not signature_header or not signature_header.startswith("sha256="):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Cryptographic signature header missing or malformed."
        )
    
    # 2. Extract SHA256 signature hash from header
    actual_signature = signature_header.split("sha256=")[1]
    
    # 3. Compute expected signature hash using SHA256 HMAC
    expected_signature = hmac.new(
        key=META_APP_SECRET.encode('utf-8'),
        msg=raw_body,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(actual_signature, expected_signature):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Signature verification failure. Payload spoofing blocked."
        )
    
    # 4. Offload heavy processing payload asynchronously to Celery, return sub-3s Fast-ACK
    payload = await request.json()
    # Enqueue into background tasks (Using FastAPIs BackgroundTasks for immediate ACK or Celery)
    background_tasks.add_task(process_inbound_payload, payload)
    
    return {"status": "enqueued_receipt"}
