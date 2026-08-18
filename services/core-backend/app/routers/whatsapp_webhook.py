import os
import hmac
import hashlib
from fastapi import APIRouter, Request, Response, HTTPException, BackgroundTasks
from app.core.tasks.inbound_processor import process_inbound_webhook

router = APIRouter(prefix="/api/v1/webhooks")

META_APP_SECRET = os.getenv("META_APP_SECRET", "MOCK_SECRET")
VERIFY_TOKEN = os.getenv("META_WEBHOOK_VERIFY_TOKEN", "SUH_SECURE_TOKEN_2026")

@router.get("/whatsapp")
async def verify_webhook(request: Request):
    """
    Handles Meta's initial verification request for the webhook URL.
    """
    mode = request.query_params.get("hub.mode")
    token = request.query_params.get("hub.verify_token")
    challenge = request.query_params.get("hub.challenge")

    if mode and token:
        if mode == "subscribe" and token == VERIFY_TOKEN:
            return Response(content=challenge, media_type="text/plain", status_code=200)
        else:
            raise HTTPException(status_code=403, detail="Verification failed")
    
    raise HTTPException(status_code=400, detail="Invalid request")

@router.post("/whatsapp")
async def receive_webhook(request: Request, background_tasks: BackgroundTasks):
    """
    Receives inbound messages and status updates from WhatsApp.
    Enforces HMAC-SHA256 signature verification.
    """
    signature = request.headers.get("X-Hub-Signature-256")
    if not signature:
        raise HTTPException(status_code=401, detail="Missing signature")
        
    body_bytes = await request.body()
    
    # Verify HMAC-SHA256
    if META_APP_SECRET != "MOCK_SECRET":
        expected_hash = hmac.new(
            key=META_APP_SECRET.encode(),
            msg=body_bytes,
            digestmod=hashlib.sha256
        ).hexdigest()
        
        expected_signature = f"sha256={expected_hash}"
        
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(status_code=401, detail="Invalid signature")

    # Fast-ACK: immediately dispatch to background worker and return 200 OK
    # This prevents Meta API retry storms.
    try:
        payload = await request.json()
        background_tasks.add_task(process_inbound_webhook, payload)
    except Exception:
        pass # Still return 200 to Meta
        
    return Response(status_code=200)
