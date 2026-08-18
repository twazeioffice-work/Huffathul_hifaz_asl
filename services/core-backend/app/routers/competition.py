# Location: services/core-backend/app/routers/competition.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/competitions")

@router.get("/")
async def list_competitions():
    return {"status": "ok", "competitions": []}
