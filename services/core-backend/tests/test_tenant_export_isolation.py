# Location: services/core-backend/tests/test_tenant_export_isolation.py
"""
Test: Cross-Tenant Export Task Isolation
Verifies that RLS policies prevent Tenant B from accessing Tenant A's report tasks.
"""
import pytest
import uuid
from unittest.mock import MagicMock, AsyncMock
from httpx import AsyncClient, ASGITransport
from app.main import app


@pytest.mark.asyncio
async def test_export_task_tenant_isolation():
    """
    Ensures that a report task enqueued by Tenant A cannot be
    retrieved or modified by Tenant B's session context.
    """
    tenant_a_task_id = str(uuid.uuid4())
    tenant_b_task_id = str(uuid.uuid4())

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Tenant A: Enqueue a student progress export
        response_a = await client.post(
            "/api/v1/reports/export/student-progress/student-001",
            headers={"X-Tenant-ID": "00000000-0000-0000-0000-000000000001"},
        )
        assert response_a.status_code == 202
        data_a = response_a.json()
        assert data_a["status"] == "pending"

        # Tenant B: Attempt to read Tenant A's task (should be isolated)
        response_b = await client.get(
            f"/api/v1/reports/tasks/{data_a['task_id']}",
            headers={"X-Tenant-ID": "00000000-0000-0000-0000-000000000002"},
        )
        # RLS policies should block cross-tenant reads → 404
        assert response_b.status_code == 404


@pytest.mark.asyncio
async def test_export_enqueue_returns_task_id():
    """
    Verifies the enqueue endpoint returns a valid task_id and pending status.
    """
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/reports/export/financial-ledger",
            headers={"X-Tenant-ID": "00000000-0000-0000-0000-000000000001"},
        )
        assert response.status_code == 202
        data = response.json()
        assert "task_id" in data
        assert data["status"] == "pending"
