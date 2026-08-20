import pytest
from app.models.affiliation import AffiliationRequestMock, AffiliationStatus, AffiliationWorkflowEngine
from app.core.tasks.broadcast_worker import BroadcastDispatchWorker

def test_tenant_affiliation_bounds():
    """
    Validation Gate: Ensures cross-tenant boundary isolation during
    community affiliation approvals.
    """
    req = AffiliationRequestMock(
        id="AFF-001",
        source_institution="TENANT_A",
        target_institution="TENANT_B",
        status=AffiliationStatus.PENDING_VERIFICATION
    )
    
    # Simulating TENANT_A trying to approve its own outbound request
    with pytest.raises(PermissionError, match="Cross-Tenant Violation"):
        AffiliationWorkflowEngine.approve_affiliation(req, active_tenant_id="TENANT_A")
        
    # Simulating TENANT_B (the target) approving the request
    assert AffiliationWorkflowEngine.approve_affiliation(req, active_tenant_id="TENANT_B") == True
    assert req.status == AffiliationStatus.APPROVED

def test_bulk_broadcast_limits():
    """
    Validation Gate: Ensures broadcast queues block massive spam payloads
    to preserve SMS/Meta API domain reputation.
    """
    recipients = ["user@example.com"] * 501
    
    response = BroadcastDispatchWorker.dispatch_community_announcement(
        tenant_id="TENANT_A",
        message="Eid Mubarak!",
        recipients=recipients
    )
    
    assert response["status"] == "RATE_LIMITED"
    assert "exceeds" in response["error"]
