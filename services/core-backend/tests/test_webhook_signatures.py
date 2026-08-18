import pytest
import hmac
import hashlib
from httpx import AsyncClient
from app.main import app
from app.routers.whatsapp_webhook import META_APP_SECRET

@pytest.mark.asyncio
async def test_webhook_signature_valid(client: AsyncClient):
    payload = b'{"test": "data"}'
    
    if META_APP_SECRET == "MOCK_SECRET":
        # Skip this test if in mock mode
        return
        
    expected_hash = hmac.new(
        key=META_APP_SECRET.encode(),
        msg=payload,
        digestmod=hashlib.sha256
    ).hexdigest()
    
    headers = {
        "X-Hub-Signature-256": f"sha256={expected_hash}",
        "Content-Type": "application/json"
    }
    
    response = await client.post("/api/v1/webhooks/whatsapp", content=payload, headers=headers)
    assert response.status_code == 200

@pytest.mark.asyncio
async def test_webhook_signature_invalid(client: AsyncClient):
    payload = b'{"test": "data"}'
    
    if META_APP_SECRET == "MOCK_SECRET":
        return
        
    headers = {
        "X-Hub-Signature-256": "sha256=invalidhash1234567890",
        "Content-Type": "application/json"
    }
    
    response = await client.post("/api/v1/webhooks/whatsapp", content=payload, headers=headers)
    assert response.status_code == 401
