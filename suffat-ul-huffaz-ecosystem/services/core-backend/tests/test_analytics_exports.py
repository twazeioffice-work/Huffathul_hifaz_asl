import pytest
from app.routers.analytics import get_financial_summary_export

def test_csv_export_formatting():
    """
    Validation Gate: Ensures the CSV engine aggregates and outputs flat streams properly.
    """
    response = get_financial_summary_export(tenant_id="suh-01", format_type="csv")
    
    assert response["content_type"] == "text/csv"
    assert "month,revenue,expenses,net" in response["data"]
    assert "January,15000,4000,11000" in response["data"]

def test_pdf_export_formatting():
    """
    Validation Gate: Ensures PDF byte headers are generated for the payload.
    """
    response = get_financial_summary_export(tenant_id="suh-01", format_type="pdf")
    
    assert response["content_type"] == "application/pdf"
    assert "%PDF-1.4" in response["data"]
    assert "%Report Title: Financial Summary" in response["data"]

def test_missing_tenant_context_analytics():
    """
    Validation Gate: Ensures analytics cross-tenant boundaries.
    """
    with pytest.raises(PermissionError, match="Missing Tenant Context"):
        get_financial_summary_export(tenant_id=None, format_type="csv")
