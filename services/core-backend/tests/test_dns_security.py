import pytest
from app.routers.branding import verify_tenant_domain_ownership

def test_dns_spoofing_prevention():
    """
    Validation Gate: Ensures malicious actors cannot map their tenant 
    to high-value domains they don't own.
    """
    with pytest.raises(PermissionError, match="DNS Verification Failed"):
        verify_tenant_domain_ownership(tenant_id="TENANT_A", domain="portal.google.com", txt_record="fake-record")

def test_valid_custom_domain():
    """
    Validation Gate: Ensures successful custom CNAME attachments 
    resolve to the tenant's brand space.
    """
    res = verify_tenant_domain_ownership(tenant_id="TENANT_B", domain="erp.myschool.edu.local", txt_record="suffat-verification=success")
    assert res["status"] == "SUCCESS"
    assert "attached to TENANT_B" in res["message"]
