import pytest
import hmac
import hashlib
from app.routers.asset import register_physical_asset
from app.routers.telemetry import ingest_gps_coordinate

def test_asset_registration_tenant_bounds():
    """
    Validation Gate: Ensures assets cannot be registered without active tenant IDs.
    """
    with pytest.raises(PermissionError, match="Cross-Tenant Isolation Breach"):
        register_physical_asset(None, {"name": "School Bus A", "value": 50000.00})

def test_telemetry_webhook_security():
    """
    Validation Gate: Validates that HMAC-SHA256 signatures are strictly enforced
    for incoming IoT data.
    """
    payload = {"lat": 24.8607, "lng": 67.0011}
    secret = "fleet_secret_123"
    
    # Calculate valid signature
    payload_str = str(payload["lat"]) + str(payload["lng"])
    valid_sig = hmac.new(secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
    
    # Test valid ingest
    res = ingest_gps_coordinate(payload, valid_sig)
    assert res["status"] == "SUCCESS"
    
    # Test forged/invalid ingest
    with pytest.raises(PermissionError, match="HMAC Signature Invalid"):
        ingest_gps_coordinate(payload, "forged_invalid_signature")
