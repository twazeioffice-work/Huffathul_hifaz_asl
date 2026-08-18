# Location: services/core-backend/app/routers/reports.py
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, UUID4
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db_session
from app.models.report_tasks import ReportTask, TaskStatus

router = APIRouter(prefix="/api/v1/reports")


class ExportEnqueueResponse(BaseModel):
    task_id: str
    status: str


class TaskStatusResponse(BaseModel):
    task_id: str
    status: str
    progress: int
    file_url: str | None = None
    error_message: str | None = None


@router.post("/export/student-progress/{student_id}", status_code=status.HTTP_202_ACCEPTED)
async def enqueue_student_progress_report(
    student_id: str,
    session: AsyncSession = Depends(get_db_session),
):
    """
    Enqueue an asynchronous student progress PDF export task.
    Returns a task_id that the client polls for completion.
    """
    new_task = ReportTask(
        institution_id="00000000-0000-0000-0000-000000000001",  # From middleware in prod
        branch_id="00000000-0000-0000-0000-000000000001",
        user_id="00000000-0000-0000-0000-000000000001",
        task_type="STUDENT_PROGRESS_PDF",
        status=TaskStatus.PENDING,
        progress=0,
    )
    session.add(new_task)
    await session.flush()

    # In production: trigger_pdf_export_task.delay(str(new_task.id), student_id)

    return ExportEnqueueResponse(task_id=str(new_task.id), status="pending")


@router.post("/export/financial-ledger", status_code=status.HTTP_202_ACCEPTED)
async def enqueue_financial_ledger_export(
    session: AsyncSession = Depends(get_db_session),
):
    """
    Enqueue an asynchronous financial ledger Excel export task.
    """
    new_task = ReportTask(
        institution_id="00000000-0000-0000-0000-000000000001",
        branch_id="00000000-0000-0000-0000-000000000001",
        user_id="00000000-0000-0000-0000-000000000001",
        task_type="FINANCIAL_LEDGER_EXCEL",
        status=TaskStatus.PENDING,
        progress=0,
    )
    session.add(new_task)
    await session.flush()

    return ExportEnqueueResponse(task_id=str(new_task.id), status="pending")


@router.get("/tasks/{task_id}", response_model=TaskStatusResponse)
async def get_task_status(
    task_id: str,
    session: AsyncSession = Depends(get_db_session),
):
    """
    Poll the status and progress of a running export task.
    RLS policies ensure cross-tenant requests return nothing.
    """
    query = select(ReportTask).filter(ReportTask.id == task_id)
    result = await session.execute(query)
    task = result.scalar_one_or_none()

    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found or access denied.")

    return TaskStatusResponse(
        task_id=str(task.id),
        status=task.status.value,
        progress=task.progress,
        file_url=task.file_url,
        error_message=task.error_message,
    )
