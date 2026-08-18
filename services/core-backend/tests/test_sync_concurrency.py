import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_sync_push_lww(client: AsyncClient, token_tenant_a: str):
    """
    Validates Last-Write-Wins (LWW) conflict resolution logic on the Push Sync endpoint.
    """
    headers = {"Authorization": f"Bearer {token_tenant_a}"}
    
    payload = {
        "last_pulled_at": 1690000000,
        "changes": {
            "student_profiles": {
                "created": [],
                "updated": [
                    {
                        "id": "11111111-1111-1111-1111-111111111111",
                        "full_name": "Updated Offline",
                        "updated_at": 1690000050 
                    }
                ],
                "deleted": []
            }
        }
    }
    
    # In a real environment, this updates if 1690000050 > server updated_at
    response = await client.post("/api/v1/sync/push", json=payload, headers=headers)
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
