from fastapi import APIRouter, Depends, HTTPException, status, Header
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from typing import Dict, Any, Optional, List
from uuid import UUID
from datetime import datetime, timezone

from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    decode_token
)

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])

# Unified single-entry dynamic landing redirection map
REDIRECTION_MAP = {
    "SUPER_ADMIN": "/app/suffat-hq/main/erp",
    "GLOBAL_ACCOUNTANT": "/app/suffat-hq/main/erp/finance",
    "CENTER_ADMIN": "/app/{institution_code}/{branch_code}/erp",
    "NAZIM": "/app/{institution_code}/{branch_code}/erp",
    "USTAD": "/app/{institution_code}/{branch_code}/erp/academics",
    "STUDENT": "/app/{institution_code}/{branch_code}/portal/student",
}

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    role: str
    landing_url: str
    user_metadata: Dict[str, Any]

# RLS context session wrapper
async def set_db_tenant_context(db: AsyncSession, tenant_id: Optional[str], role: str):
    """
    Sets session-level context parameters in PostgreSQL.
    Enforces Row-Level Security (RLS) policies based on the active transaction scope.
    """
    if tenant_id:
        # Prevent SQL injections by parsing as text bind parameters or direct UUID cast
        await db.execute(
            text("SET LOCAL app.current_tenant_id = :tenant_id"),
            {"tenant_id": tenant_id}
        )
    else:
        await db.execute(text("SET LOCAL app.current_tenant_id = ''"))
        
    await db.execute(
        text("SET LOCAL app.current_role = :role"),
        {"role": role}
    )

def calculate_landing_route(role: str, institution_code: Optional[str] = None, branch_code: Optional[str] = None) -> str:
    """
    Computes the target workspace path based on user role and multi-tenant keys.
    """
    template = REDIRECTION_MAP.get(role)
    if not template:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role does not have an assigned workspace landing path."
        )
    
    # Format templates if they require multi-tenant codes
    if "{" in template:
        if not institution_code or not branch_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unified role '{role}' requires valid institution and branch routing headers."
            )
        return template.format(institution_code=institution_code, branch_code=branch_code)
        
    return template

@router.post("/token", response_model=TokenResponse)
async def login(payload: LoginRequest):
    """
    Unified Login Entrypoint.
    Authenticates username/email, generates dynamic claims, and returns custom landing redirects.
    """
    # 1. Mock DB query lookup (simulating SQL execution)
    # In production:
    # user = (await db.execute(select(User).where(User.username == payload.username_or_email))).scalar_one_or_none()
    
    # Standard multi-tenant system profiles mapped to our database partitions
    users_db = {
        "admin@suffat.com": {
            "id": "e9a8f102-1234-4bc1-9003-cf782ad901ab",
            "password_hash": hash_password("AdminSecurePass123"),
            "role": "SUPER_ADMIN",
            "tenant_id": None,
            "institution_code": None,
            "branch_code": None,
            "display_name": "Sheikh Tariq (HQ Overseer)",
        },
        "nazim@kerala.com": {
            "id": "c138d821-2290-410a-8bf1-e4f0a9bc4991",
            "password_hash": hash_password("NazimPass456"),
            "role": "NAZIM",
            "tenant_id": "8821901a-8bc2-4ccb-8e10-cf123abcf01a",
            "institution_code": "aim-kerala",
            "branch_code": "trv-main",
            "display_name": "Br. Yusuf Ali (Kerala Center Admin)",
        },
        "ustad@sabaq.com": {
            "id": "b300fa11-4433-4ee1-b921-ef783ab81122",
            "password_hash": hash_password("UstadSabaq789"),
            "role": "USTAD",
            "tenant_id": "8821901a-8bc2-4ccb-8e10-cf123abcf01a",
            "institution_code": "aim-kerala",
            "branch_code": "trv-main",
            "display_name": "Ustad Bilal Mansoor",
        },
        "student@suffat.org": {
            "id": "a900fa11-4433-4ee1-b921-ef783ab81199",
            "password_hash": hash_password("password"),
            "role": "STUDENT",
            "tenant_id": "8821901a-8bc2-4ccb-8e10-cf123abcf01a",
            "institution_code": "aim-kerala",
            "branch_code": "trv-main",
            "display_name": "Student User",
        }
    }
    
    user = users_db.get(payload.username_or_email)
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials. Please try again."
        )
    
    # 2. Extract multi-tenant scope variables
    role = user["role"]
    tenant_id = user["tenant_id"]
    inst_code = user["institution_code"]
    br_code = user["branch_code"]
    
    # 3. Compute target landing path
    landing_url = calculate_landing_route(role, inst_code, br_code)
    
    # 4. Generate dynamic access claims
    access_claims = {
        "sub": user["id"],
        "role": role,
        "tenant_id": tenant_id,
        "institution_code": inst_code,
        "branch_code": br_code,
        "name": user["display_name"],
        "permissions": ["sabaq_records:write", "attendance:mark"] if role == "USTAD" else ["all:bypass"] if role == "SUPER_ADMIN" else ["center_records:manage"]
    }
    
    access_token = create_access_token(access_claims)
    refresh_token = create_refresh_token({"sub": user["id"]})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "role": role,
        "landing_url": landing_url,
        "user_metadata": {
            "display_name": user["display_name"],
            "institution_code": inst_code,
            "branch_code": br_code,
            "tenant_id": tenant_id
        }
    }
