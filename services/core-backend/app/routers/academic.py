import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.session import get_db_session
from app.models.academic import Course, Subject, CourseSubject, SyllabusModule

router = APIRouter(prefix="/api/v1/app/{inst_code}/{br_code}/academics")

# Pydantic Schemas
class CourseCreate(BaseModel):
    code: str
    name: str
    duration_months: int = 12
    grading_system: str = "Percentage"
    branch_id: uuid.UUID

class CourseResponse(CourseCreate):
    id: uuid.UUID

class SubjectCreate(BaseModel):
    code: str
    name: str
    subject_type: str = "Core"
    credits: int = 1
    branch_id: uuid.UUID

class SubjectResponse(SubjectCreate):
    id: uuid.UUID

# Routes
@router.post("/courses", response_model=CourseResponse, status_code=status.HTTP_201_CREATED)
async def create_course(
    inst_code: str,
    br_code: str,
    course_in: CourseCreate,
    session: AsyncSession = Depends(get_db_session)
):
    async with session.begin():
        existing = await session.execute(select(Course).filter_by(branch_id=course_in.branch_id, code=course_in.code))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Course code already exists in this branch.")
        
        new_course = Course(**course_in.dict())
        session.add(new_course)
    
    return new_course

@router.get("/courses", response_model=List[CourseResponse])
async def list_courses(
    inst_code: str,
    br_code: str,
    branch_id: uuid.UUID,
    session: AsyncSession = Depends(get_db_session)
):
    result = await session.execute(select(Course).filter_by(branch_id=branch_id))
    return result.scalars().all()

@router.post("/subjects", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    inst_code: str,
    br_code: str,
    subject_in: SubjectCreate,
    session: AsyncSession = Depends(get_db_session)
):
    async with session.begin():
        existing = await session.execute(select(Subject).filter_by(branch_id=subject_in.branch_id, code=subject_in.code))
        if existing.scalar_one_or_none():
            raise HTTPException(status_code=400, detail="Subject code already exists in this branch.")
            
        new_subject = Subject(**subject_in.dict())
        session.add(new_subject)
        
    return new_subject
