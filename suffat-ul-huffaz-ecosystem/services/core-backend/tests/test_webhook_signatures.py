import pytest
import hmac
import hashlib
import json
from app.routers.whatsapp_webhook import whatsapp_webhook_ingest
from app.core.tasks.inbound_processor import IdentityResolutionWorker

def test_webhook_cryptographic_forgery():
    """
    Validation Gate: Ensures rogue endpoints cannot spoof WhatsApp payloads.
    """
    payload = {"object": "whatsapp_business_account", "entry": [{"id": "123"}]}
    
    # 1. Valid Signature
    payload_str = json.dumps(payload, separators=(',', ':'))
    valid_sig = "sha256=" + hmac.new(b"meta_app_secret_123", payload_str.encode(), hashlib.sha256).hexdigest()
    
    res = whatsapp_webhook_ingest(payload, valid_sig)
    assert res["status"] == "ACK"
    
    # 2. Forged Signature
    with pytest.raises(PermissionError, match="Signature Forgery Detected"):
        whatsapp_webhook_ingest(payload, "sha256=invalid_forged_hash_abc123")

def test_tenant_identity_resolution():
    """
    Validation Gate: Ensures cross-tenant leaks don't happen in the AI Helpdesk.
    """
    tenant = IdentityResolutionWorker.resolve_phone_to_tenant("1234567890")
    assert tenant == "TENANT_A"
    
    with pytest.raises(ValueError, match="Unknown Phone Number"):
        IdentityResolutionWorker.resolve_phone_to_tenant("5555555555")
