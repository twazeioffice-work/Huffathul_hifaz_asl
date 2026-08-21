import datetime
from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field
from app.db.session import get_db_session
from app.core.security import set_db_tenant_context, get_current_user
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, insert, text

router = APIRouter(prefix="/api/v1/sync", tags=["Offline Browser Sync"])

# --- Sync Input Schemas ---
class SabaqSyncItem(BaseModel):
    id: UUID
    studentEnrollmentId: UUID = Field(..., alias="studentEnrollmentId")
    juzNumber: int = Field(..., alias="juzNumber")
    pageStart: int = Field(..., alias="pageStart")
    pageEnd: int = Field(..., alias="pageEnd")
    grade: str
    teacherNotes: Optional[str] = Field(None, alias="teacherNotes")
    lastModifiedAt: datetime.datetime = Field(..., alias="lastModifiedAt")

class AttendanceSyncItem(BaseModel):
    id: str
    studentEnrollmentId: UUID = Field(..., alias="studentEnrollmentId")
    date: datetime.date
    fajr: str
    dhuhr: str
    asr: str
    maghrib: str
    isha: str
    lastModifiedAt: datetime.datetime = Field(..., alias="lastModifiedAt")

class SyncPayloadSchema(BaseModel):
    branch_id: UUID
    last_pulled_at: datetime.datetime
    sabaq_updates: List[SabaqSyncItem]
    attendance_updates: List[AttendanceSyncItem]

# --- Router Ingestion Logic ---

@router.post("/push-pull", status_code=status.HTTP_200_OK)
async def sync_push_pull_gateway(
    payload: SyncPayloadSchema,
    db: AsyncSession = Depends(get_db_session),
    current_user: dict = Depends(get_current_user)
):
    """
    Processes batch changes pushed from mobile browser IndexedDB storage and returns
    deltas generated on the server since the user's last pull request.
    Enforces strict RLS boundary isolation throughout transaction lifetime.
    """
    # 1. Establish database connection context under JWT Tenant Claims
    await set_db_tenant_context(db, current_user["tenant_id"], payload.branch_id, current_user["id"])
    
    server_sync_time = datetime.datetime.utcnow()

    # 2. Process Client Sabaq Push (Last-Write-Wins Conflict Resolution)
    for client_sabaq in payload.sabaq_updates:
        # Check if record exists on server
        query = text("""
            SELECT last_modified_at FROM hifz_sabaq_records 
            WHERE id = :id AND branch_id = :branch_id
        """)
        result = await db.execute(query, {"id": client_sabaq.id, "branch_id": payload.branch_id})
        server_record = result.fetchone()

        if not server_record:
            # Insert brand new offline-generated record
            insert_query = text("""
                INSERT INTO hifz_sabaq_records (
                    id, institution_id, branch_id, student_enrollment_id, staff_id, 
                    date, juz_number, page_start, page_end, grade, teacher_notes, last_modified_at
                ) VALUES (
                    :id, :inst_id, :branch_id, :student_id, :staff_id, 
                    CURRENT_DATE, :juz, :p_start, :p_end, :grade, :notes, :last_mod
                )
            """)
            await db.execute(insert_query, {
                "id": client_sabaq.id,
                "inst_id": current_user["tenant_id"],
                "branch_id": payload.branch_id,
                "student_id": client_sabaq.studentEnrollmentId,
                "staff_id": current_user["id"],
                "juz": client_sabaq.juzNumber,
                "p_start": client_sabaq.pageStart,
                "p_end": client_sabaq.pageEnd,
                "grade": client_sabaq.grade,
                "notes": client_sabaq.teacherNotes,
                "last_mod": client_sabaq.lastModifiedAt
            })
        elif client_sabaq.lastModifiedAt > server_record.last_modified_at:
            # Client has newer update; resolve conflict via LWW Override
            update_query = text("""
                UPDATE hifz_sabaq_records SET
                    juz_number = :juz,
                    page_start = :p_start,
                    page_end = :p_end,
                    grade = :grade,
                    teacher_notes = :notes,
                    last_modified_at = :last_mod
                WHERE id = :id AND branch_id = :branch_id
            """)
            await db.execute(update_query, {
                "id": client_sabaq.id,
                "branch_id": payload.branch_id,
                "juz": client_sabaq.juzNumber,
                "p_start": client_sabaq.pageStart,
                "p_end": client_sabaq.pageEnd,
                "grade": client_sabaq.grade,
                "notes": client_sabaq.teacherNotes,
                "last_mod": client_sabaq.lastModifiedAt
            })

    # 3. Process Client Attendance Push (LWW Resolution)
    for client_att in payload.attendance_updates:
        query = text("""
            SELECT last_modified_at FROM prayer_attendance 
            WHERE id = :id AND branch_id = :branch_id
        """)
        result = await db.execute(query, {"id": client_att.id, "branch_id": payload.branch_id})
        server_record = result.fetchone()

        fajr_bool = client_att.fajr == "PRESENT"
        dhuhr_bool = client_att.dhuhr == "PRESENT"
        asr_bool = client_att.asr == "PRESENT"
        maghrib_bool = client_att.maghrib == "PRESENT"
        isha_bool = client_att.isha == "PRESENT"

        if not server_record:
            insert_query = text("""
                INSERT INTO prayer_attendance (
                    id, institution_id, branch_id, student_enrollment_id, date,
                    fajr, dhuhr, asr, maghrib, isha, last_modified_at
                ) VALUES (
                    :id, :inst_id, :branch_id, :student_id, :date,
                    :fajr, :dhuhr, :asr, :maghrib, :isha, :last_mod
                )
            """)
            await db.execute(insert_query, {
                "id": client_att.id,
                "inst_id": current_user["tenant_id"],
                "branch_id": payload.branch_id,
                "student_id": client_att.studentEnrollmentId,
                "date": client_att.date,
                "fajr": fajr_bool,
                "dhuhr": dhuhr_bool,
                "asr": asr_bool,
                "maghrib": maghrib_bool,
                "isha": isha_bool,
                "last_mod": client_att.lastModifiedAt
            })
        elif client_att.lastModifiedAt > server_record.last_modified_at:
            update_query = text("""
                UPDATE prayer_attendance SET
                    fajr = :fajr,
                    dhuhr = :dhuhr,
                    asr = :asr,
                    maghrib = :maghrib,
                    isha = :isha,
                    last_modified_at = :last_mod
                WHERE id = :id AND branch_id = :branch_id
            """)
            await db.execute(update_query, {
                "id": client_att.id,
                "branch_id": payload.branch_id,
                "fajr": fajr_bool,
                "dhuhr": dhuhr_bool,
                "asr": asr_bool,
                "maghrib": maghrib_bool,
                "isha": isha_bool,
                "last_mod": client_att.lastModifiedAt
            })

    await db.commit()

    # 4. Pull Server Deltas (Retrieve modifications made since client's last_pulled_at)
    sabaq_deltas_query = text("""
        SELECT id, student_enrollment_id, juz_number, page_start, page_end, grade, teacher_notes, last_modified_at 
        FROM hifz_sabaq_records
        WHERE branch_id = :branch_id AND last_modified_at > :last_pull
    """)
    sabaq_result = await db.execute(sabaq_deltas_query, {"branch_id": payload.branch_id, "last_pull": payload.last_pulled_at})
    sabaq_deltas = [
        {
            "id": row.id,
            "studentEnrollmentId": row.student_enrollment_id,
            "juzNumber": row.juz_number,
            "pageStart": row.page_start,
            "pageEnd": row.page_end,
            "grade": row.grade,
            "teacherNotes": row.teacher_notes,
            "lastModifiedAt": row.last_modified_at.isoformat()
        } for row in sabaq_result.fetchall()
    ]

    attendance_deltas_query = text("""
        SELECT id, student_enrollment_id, date, fajr, dhuhr, asr, maghrib, isha, last_modified_at 
        FROM prayer_attendance
        WHERE branch_id = :branch_id AND last_modified_at > :last_pull
    """)
    att_result = await db.execute(attendance_deltas_query, {"branch_id": payload.branch_id, "last_pull": payload.last_pulled_at})
    attendance_deltas = [
        {
            "id": row.id,
            "studentEnrollmentId": row.student_enrollment_id,
            "date": row.date.isoformat(),
            "fajr": "PRESENT" if row.fajr else "ABSENT",
            "dhuhr": "PRESENT" if row.dhuhr else "ABSENT",
            "asr": "PRESENT" if row.asr else "ABSENT",
            "maghrib": "PRESENT" if row.maghrib else "ABSENT",
            "isha": "PRESENT" if row.isha else "ABSENT",
            "lastModifiedAt": row.last_modified_at.isoformat()
        } for row in att_result.fetchall()
    ]

    return {
        "server_time": server_sync_time.isoformat(),
        "sabaq_deltas": sabaq_deltas,
        "attendance_deltas": attendance_deltas
    }
