import pytest
import hmac
import hashlib
import json
from httpx import AsyncClient, ASGITransport
from app.main import app
from app.routers.telemetry import SIGNING_SECRET

@pytest.mark.asyncio
async def test_telemetry_webhook_signature_validation():
    """
    Asserts that the telemetry gateway enforces HMAC-SHA256 source signature checks,
    and returns fast-ACK 200 OK for valid packets and 401 for invalid.
    """
    transport = ASGITransport(app=app)
    
    packet_data = {
        "tracker_token": "fleet-vh-001-sec",
        "timestamp": "2026-08-18T16:00:00Z",
        "latitude": 31.5204,
        "longitude": 74.3587,
        "speed_kmh": 45.2,
        "heading": 180
    }
    raw_payload = json.dumps(packet_data).encode("utf-8")
    
    # 1. Test Valid Signature
    valid_sig = hmac.new(SIGNING_SECRET.encode(), raw_payload, hashlib.sha256).hexdigest()
    
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/telemetry/gps",
            content=raw_payload,
            headers={"X-Telemetry-Signature-256": valid_sig}
        )
        assert response.status_code == 200
        assert response.json()["status"] == "enqueued"
        
        # 2. Test Invalid Signature (Spoofed)
        invalid_sig = "a" * 64
        response_spoofed = await client.post(
            "/api/v1/telemetry/gps",
            content=raw_payload,
            headers={"X-Telemetry-Signature-256": invalid_sig}
        )
        assert response_spoofed.status_code == 401
        
        # 3. Test Missing Signature
        response_missing = await client.post(
            "/api/v1/telemetry/gps",
            content=raw_payload,
        )
        assert response_missing.status_code == 401
