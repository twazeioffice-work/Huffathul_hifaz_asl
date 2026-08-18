from fastapi import APIRouter, Cookie, Response, HTTPException, status, Depends
from pydantic import BaseModel
from hashlib import sha256
from app.core.security import generate_tokens, decode_refresh_jwt, verify_password
from app.db.session import get_db
from app.models.identity import User, UserSession
import datetime
import uuid

router = APIRouter(prefix="/api/v1/auth")

class LoginRequest(BaseModel):
    email: str
    password: str

class VerifyMFARequest(BaseModel):
    email: str
    totp: str
    mfa_token: str

@router.post("/login")
async def login(req: LoginRequest, db = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user or not verify_password(req.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
        
    return {"status": "Step 2 MFA Challenge Verification Required", "mfa_token": "mock-mfa-token-123"}

@router.post("/verify-mfa")
async def verify_mfa(req: VerifyMFARequest, response: Response, db = Depends(get_db)):
    if req.totp != "123456":
        raise HTTPException(status_code=400, detail="Invalid TOTP")
    
    user = db.query(User).filter(User.email == req.email).first()
    family_id = uuid.uuid4()
    tenants = [{"inst_code": "suh01", "br_code": "mn01", "inst_id": "00000000-0000-0000-0000-000000000000"}] # Mocked for simplicity
    
    access_token, refresh_token, expires = generate_tokens(user.id, family_id, tenants)
    
    new_hash = sha256(refresh_token.encode('utf-8')).hexdigest()
    session_record = UserSession(
        user_id=user.id,
        institution_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
        branch_id=uuid.UUID("00000000-0000-0000-0000-000000000000"),
        token_family_id=family_id,
        refresh_token_hash=new_hash,
        expires_at=expires,
        is_revoked=False
    )
    db.add(session_record)
    db.commit()
    
    response.set_cookie(key="refresh_token", value=refresh_token, httponly=True, secure=True, samesite="Strict", expires=expires)
    return {"access_token": access_token}

@router.post("/refresh")
async def rotate_tokens(
    response: Response,
    refresh_token: str = Cookie(None, alias="refresh_token"),
    db = Depends(get_db)
):
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Session context missing. Refresh token cookie not found.")
        
    incoming_hash = sha256(refresh_token.encode('utf-8')).hexdigest()
    
    try:
        claims = decode_refresh_jwt(refresh_token)
        family_id = claims["family_id"]
        user_id = claims["user_id"]
    except Exception:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Malformed session credentials.")
        
    session_record = db.query(UserSession).filter(UserSession.refresh_token_hash == incoming_hash).first()
    
    if not session_record or session_record.is_revoked:
        db.query(UserSession).filter(UserSession.token_family_id == family_id).update({"is_revoked": True})
        db.commit()
        response.delete_cookie("refresh_token")
        response.delete_cookie("access_token")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Security Violation. Session breach detected. All access channels revoked.")
        
    now = datetime.datetime.now(datetime.timezone.utc)
    time_since_creation = now - session_record.created_at
    if time_since_creation.total_seconds() <= 5.0:
        youngest_sibling = db.query(UserSession).filter(
            UserSession.token_family_id == family_id,
            UserSession.is_revoked == False
        ).order_by(UserSession.created_at.desc()).first()
        
        if youngest_sibling:
            return {"status": "success", "grace_period_bypass": True}
            
    session_record.is_revoked = True
    new_access_token, new_refresh_token, new_expires = generate_tokens(user_id=user_id, family_id=family_id, tenants=claims["tenants"])
    
    new_hash = sha256(new_refresh_token.encode('utf-8')).hexdigest()
    new_session = UserSession(
        user_id=user_id,
        institution_id=session_record.institution_id,
        branch_id=session_record.branch_id,
        token_family_id=family_id,
        refresh_token_hash=new_hash,
        expires_at=new_expires,
        is_revoked=False
    )
    db.add(new_session)
    db.commit()
    
    response.set_cookie(key="refresh_token", value=new_refresh_token, httponly=True, secure=True, samesite="Strict", expires=new_expires)
    return {"access_token": new_access_token}
