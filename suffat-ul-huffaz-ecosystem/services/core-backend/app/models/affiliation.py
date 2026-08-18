from enum import Enum
from datetime import datetime

class AffiliationStatus(Enum):
    PENDING_VERIFICATION = "PENDING_VERIFICATION"
    APPROVED = "APPROVED"
    REJECTED = "REJECTED"
    SUSPENDED = "SUSPENDED"

class AffiliationRequestMock:
    """
    Mock SQLAlchemy Model mapped to Phase 8 DDL schemas.
    Enforces Row-Level Security via institution_id bindings.
    """
    def __init__(self, id: str, source_institution: str, target_institution: str, status: AffiliationStatus):
        self.id = id
        self.source_institution_id = source_institution
        self.target_institution_id = target_institution
        self.status = status
        self.created_at = datetime.now()

class AffiliationWorkflowEngine:
    @staticmethod
    def approve_affiliation(request: AffiliationRequestMock, active_tenant_id: str) -> bool:
        """
        State Machine Transition: Verifies that only the target institution
        can approve a pending inbound affiliation request.
        """
        if request.target_institution_id != active_tenant_id:
            raise PermissionError("Cross-Tenant Violation: Cannot approve affiliations for other institutions.")
        
        if request.status != AffiliationStatus.PENDING_VERIFICATION:
            raise ValueError(f"Invalid State Transition: Cannot approve request in state {request.status}")
            
        request.status = AffiliationStatus.APPROVED
        return True
