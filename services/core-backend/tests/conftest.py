import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as c:
        yield c

@pytest.fixture
def token_tenant_a():
    return "MOCK_TOKEN_A"

@pytest.fixture
def tenant_b_branch_id():
    return "00000000-0000-0000-0000-000000000001"
