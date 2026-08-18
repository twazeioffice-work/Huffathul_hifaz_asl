# Location: services/core-backend/app/routers/alumni.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/alumni")

@router.get("/")
async def list_alumni():
    return {"status": "ok", "alumni": []}
