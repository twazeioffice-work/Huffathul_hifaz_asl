import pytest
import hmac
import hashlib
import json

def whatsapp_webhook_ingest(payload, sig):
    if sig != "sha256=" + hmac.new(b"meta_app_secret_123", json.dumps(payload, separators=(',', ':')).encode(), hashlib.sha256).hexdigest():
        raise PermissionError("Signature Forgery Detected")
    return {"status": "ACK"}

def test_webhook_cryptographic_forgery():
    payload = {"object": "whatsapp_business_account", "entry": [{"id": "123"}]}
    payload_str = json.dumps(payload, separators=(',', ':'))
    valid_sig = "sha256=" + hmac.new(b"meta_app_secret_123", payload_str.encode(), hashlib.sha256).hexdigest()
    res = whatsapp_webhook_ingest(payload, valid_sig)
    assert res["status"] == "ACK"
    with pytest.raises(PermissionError, match="Signature Forgery Detected"):
        whatsapp_webhook_ingest(payload, "sha256=invalid_forged_hash_abc123")
