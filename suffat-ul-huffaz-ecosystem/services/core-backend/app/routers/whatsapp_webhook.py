import hashlib
import hmac
import json

def verify_meta_webhook(payload: dict, signature: str, app_secret: str = "meta_app_secret_123") -> bool:
    """
    Verifies that the webhook payload actually came from Meta/WhatsApp.
    Using HMAC-SHA256 of the payload matching the X-Hub-Signature header.
    """
    payload_str = json.dumps(payload, separators=(',', ':'))
    expected_signature = hmac.new(app_secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
    
    # In production, signature comes prefixed with 'sha256='
    clean_sig = signature.replace('sha256=', '')
    return hmac.compare_digest(expected_signature, clean_sig)

def whatsapp_webhook_ingest(payload: dict, signature: str):
    """
    FastAPI Router Mock: POST /api/v1/webhooks/whatsapp
    """
    if not verify_meta_webhook(payload, signature):
        raise PermissionError("Unauthorized Webhook: Signature Forgery Detected")
        
    return {"status": "ACK", "queued_for_resolution": True}
