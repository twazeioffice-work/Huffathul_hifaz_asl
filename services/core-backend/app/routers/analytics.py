from app.reports.exporter import ReportExportEngine

def get_financial_summary_export(tenant_id: str, format_type: str = "csv"):
    """
    FastAPI Router Mock: GET /api/v1/analytics/financial
    """
    # Cross-tenant bound assertion mock (would be in middleware/dependencies)
    if not tenant_id:
        raise PermissionError("Missing Tenant Context")
        
    # Mock aggregated analytical data
    data = [
        {"month": "January", "revenue": 15000, "expenses": 4000, "net": 11000},
        {"month": "February", "revenue": 18000, "expenses": 4200, "net": 13800}
    ]
    
    if format_type == "csv":
        return {
            "content_type": "text/csv", 
            "data": ReportExportEngine.generate_csv_report(data)
        }
    elif format_type == "pdf":
        return {
            "content_type": "application/pdf", 
            "data": ReportExportEngine.generate_pdf_report("Financial Summary", data).decode('utf-8')
        }
    
    raise ValueError("Unsupported format type")
