import json

class ReportExportEngine:
    """
    Mock Data Export Engine for Phase 10.
    In production, integrates with ReportLab (PDF) and Pandas (CSV/XLSX).
    """
    
    @staticmethod
    def generate_csv_report(data: list) -> str:
        """
        Generates a flat CSV from a list of dicts.
        """
        if not data:
            return ""
            
        headers = list(data[0].keys())
        csv_rows = [",".join(headers)]
        
        for row in data:
            csv_rows.append(",".join(str(row.get(h, "")) for h in headers))
            
        return "\n".join(csv_rows)

    @staticmethod
    def generate_pdf_report(title: str, data: list) -> bytes:
        """
        Mocks a PDF byte stream generation for the report.
        """
        # Mocking PDF header bytes
        pdf_mock = f"%PDF-1.4\n%Report Title: {title}\n%Records: {len(data)}".encode('utf-8')
        return pdf_mock
