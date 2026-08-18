# Location: services/core-backend/app/core/tasks/export_worker.py
import time
from celery import Celery
from app.core.reports.pdf_generator import generate_progress_report_pdf
from app.core.reports.excel_generator import generate_financial_ledger_excel

celery_app = Celery("export_tasks", broker="redis://localhost:6379/0")


@celery_app.task(bind=True, max_retries=3)
def trigger_pdf_export_task(self, task_id: str, student_id: str):
    """
    Background Celery task that:
    1. Retrieves tenant-scoped student data
    2. Serializes a PDF progress report via ReportLab
    3. Saves the output to local storage (or GCS in production)
    4. Updates the report_tasks record with file_url and status
    """
    try:
        # Phase 1: Simulate data retrieval (in production, query via RLS-scoped session)
        update_task_progress(task_id, 10)

        mock_sabaq = [
            {"date": "2026-08-01", "juz_number": 1, "page_start": 1, "page_end": 5, "grade": "A"},
            {"date": "2026-08-03", "juz_number": 1, "page_start": 6, "page_end": 10, "grade": "A-"},
            {"date": "2026-08-05", "juz_number": 1, "page_start": 11, "page_end": 15, "grade": "B+"},
            {"date": "2026-08-07", "juz_number": 2, "page_start": 1, "page_end": 4, "grade": "A"},
        ]

        # Phase 2: Render PDF
        update_task_progress(task_id, 40)
        pdf_bytes = generate_progress_report_pdf(
            student_name="Muhammad Ahmad bin Khalid",
            attendance=94.5,
            grade="A",
            sabaq_list=mock_sabaq,
        )

        # Phase 3: Write to local storage (swap to GCS client in production)
        update_task_progress(task_id, 70)
        output_path = f"/tmp/reports/{task_id}.pdf"
        import os
        os.makedirs("/tmp/reports", exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(pdf_bytes)

        # Phase 4: Mark complete
        update_task_progress(task_id, 100, file_url=output_path)
        return {"status": "completed", "file_url": output_path}

    except Exception as exc:
        update_task_progress(task_id, -1, error=str(exc))
        raise self.retry(exc=exc, countdown=10)


@celery_app.task(bind=True, max_retries=3)
def trigger_excel_export_task(self, task_id: str):
    """
    Background Celery task for financial ledger Excel generation.
    """
    try:
        update_task_progress(task_id, 10)

        mock_ledger = [
            {"code": "1001", "name": "Tuition Fee Receivable", "type": "Asset", "debit": 125000, "credit": 0},
            {"code": "2001", "name": "Accounts Payable", "type": "Liability", "debit": 0, "credit": 45000},
            {"code": "3001", "name": "Endowment Reserve", "type": "Equity", "debit": 0, "credit": 200000},
            {"code": "4001", "name": "Tuition Revenue", "type": "Revenue", "debit": 0, "credit": 350000},
            {"code": "5001", "name": "Staff Salary Expense", "type": "Expense", "debit": 180000, "credit": 0},
        ]

        update_task_progress(task_id, 50)
        excel_bytes = generate_financial_ledger_excel(ledgers_data=mock_ledger)

        output_path = f"/tmp/reports/{task_id}.xlsx"
        import os
        os.makedirs("/tmp/reports", exist_ok=True)
        with open(output_path, "wb") as f:
            f.write(excel_bytes)

        update_task_progress(task_id, 100, file_url=output_path)
        return {"status": "completed", "file_url": output_path}

    except Exception as exc:
        update_task_progress(task_id, -1, error=str(exc))
        raise self.retry(exc=exc, countdown=10)


def update_task_progress(task_id: str, progress: int, file_url: str = None, error: str = None):
    """
    Updates task progress in Redis for real-time polling.
    In production, also updates the report_tasks DB row.
    """
    import redis
    r = redis.StrictRedis(host="localhost", port=6379, db=2)
    state = {
        "progress": progress,
        "status": "completed" if progress == 100 else ("failed" if progress < 0 else "running"),
    }
    if file_url:
        state["file_url"] = file_url
    if error:
        state["error"] = error
    r.hset(f"report_task:{task_id}", mapping=state)
    r.expire(f"report_task:{task_id}", 3600)  # 1-hour TTL
