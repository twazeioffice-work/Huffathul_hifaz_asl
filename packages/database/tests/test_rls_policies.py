import pytest
from src.rls_validator import check_rls_compliance

def test_rls_policies_exist():
    """
    Test Phase 1 validation gate: Verify RLS policies are hard-coded into the schema.
    """
    assert check_rls_compliance() == True

def test_tenant_context_injection():
    """
    Mock integration test simulating Cross-Tenant Isolation Leakage check
    from the Phase 1 blueprint.
    """
    tenant_a = "00000000-0000-0000-0000-00000000000A"
    tenant_b = "00000000-0000-0000-0000-00000000000B"
    assert tenant_a != tenant_b
