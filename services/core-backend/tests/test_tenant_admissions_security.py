import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_tenant_isolation_admission(client: AsyncClient, token_tenant_a: str, tenant_b_branch_id: str):
    """
    Test that a user with Tenant A's token cannot enroll a student into Tenant B's branch.
    The interceptor/middleware should reject this cross-tenant admission.
    """
    headers = {"Authorization": f"Bearer {token_tenant_a}"}
    payload = {
        "branch_id": tenant_b_branch_id,
        "academic_year_id": "00000000-0000-0000-0000-000000000000",
        "batch_id": "00000000-0000-0000-0000-000000000000",
        "email": "cross.tenant.hack@example.com",
        "full_name": "Hacker",
        "phone_number": "1234567890",
        "date_of_birth": "2010-01-01",
        "gender": "Male",
        "guardian_name": "Guardian",
        "guardian_phone": "0987654321"
    }

    response = await client.post("/api/v1/admissions/enroll", json=payload, headers=headers)
    
    # Expect 403 Forbidden because branch_id does not match the token's allowed tenants
    assert response.status_code == 403
