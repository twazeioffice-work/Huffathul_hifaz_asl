import hashlib
import hmac

def verify_telemetry_webhook(payload: dict, signature: str, secret: str = "fleet_secret_123") -> bool:
    """
    Simulates HMAC-SHA256 signature verification for IoT GPS ingests.
    Ensures rogue devices cannot inject fake GPS telemetry data.
    """
    # Simple mock serialization
    payload_str = str(payload.get("lat")) + str(payload.get("lng"))
    expected_signature = hmac.new(secret.encode(), payload_str.encode(), hashlib.sha256).hexdigest()
    
    return hmac.compare_digest(expected_signature, signature)

def ingest_gps_coordinate(payload: dict, signature: str) -> dict:
    """
    FastAPI Router Mock: POST /api/v1/telemetry/ingest
    """
    if not verify_telemetry_webhook(payload, signature):
        raise PermissionError("HMAC Signature Invalid. Ingest Rejected.")
        
    return {"status": "SUCCESS", "logged_at": "now"}
