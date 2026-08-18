# Location: services/core-backend/app/routers/telemetry.py
import hmac
import hashlib
from fastapi import APIRouter, Request, HTTPException, status, BackgroundTasks
from pydantic import BaseModel, Field
from datetime import datetime
from app.core.tasks.telemetry_worker import process_telemetry_coordinates

router = APIRouter(prefix="/api/v1/telemetry")

SIGNING_SECRET = "your-custom-high-frequency-telemetry-key"

class TelemetryPacket(BaseModel):
    tracker_token: str
    timestamp: datetime
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    speed_kmh: float = Field(..., ge=0.0)
    heading: int = Field(..., ge=0, le=360)

@router.post("/gps", status_code=status.HTTP_200_OK)
async def ingest_vehicle_coordinates(
    request: Request,
    packet: TelemetryPacket,
    background_tasks: BackgroundTasks
):
    # 1. Enforce high-concurrency source payload validation check
    raw_payload = await request.body()
    signature_header = request.headers.get("X-Telemetry-Signature-256")
    
    if not signature_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing signature token.")
        
    expected_sig = hmac.new(
        SIGNING_SECRET.encode(),
        raw_payload,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(expected_sig, signature_header):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Cryptographic verification failed.")

    # 2. Defer computation to background workers for immediate sub-15ms ACK response
    background_tasks.add_task(
        process_telemetry_coordinates.delay, # Using celery async dispatch
        packet.tracker_token,
        packet.timestamp,
        packet.latitude,
        packet.longitude,
        packet.speed_kmh,
        packet.heading
    )
    
    return {"status": "enqueued"}
