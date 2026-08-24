from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session
from src.db.database import get_db
from src.db.models import User, Tenant, Branch
from src.core.security import verify_password, create_access_token
from pydantic import BaseModel

router = APIRouter()

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

@router.post("/token")
def login(login_req: LoginRequest, response: Response, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_req.username_or_email).first()
    if not user or not verify_password(login_req.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    tenant = db.query(Tenant).filter(Tenant.id == user.tenant_id).first() if user.tenant_id else None
    branch = db.query(Branch).filter(Branch.id == user.branch_id).first() if user.branch_id else None
    
    institution_code = tenant.institution_code if tenant else "tenant"
    branch_code = branch.branch_code if branch else "branch"
    
    payload = {
        "sub": user.email,
        "role": user.role,
        "institution_code": institution_code,
        "branch_code": branch_code
    }
    
    access_token = create_access_token(data=payload)
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        path="/",
        samesite="lax"
    )
    
    # Resolve landing URL
    role_home = {
        "SUPER_ADMIN": "/app/suffat-hq/main/erp",
        "CENTER_ADMIN": f"/app/{institution_code}/{branch_code}/erp",
        "NAZIM": f"/app/{institution_code}/{branch_code}/erp",
        "USTAD": f"/app/{institution_code}/{branch_code}/erp/academics",
        "STUDENT": f"/app/{institution_code}/{branch_code}/portal/student",
        "PARENT": f"/app/{institution_code}/{branch_code}/portal/parent"
    }
    
    return {"landing_url": role_home.get(user.role, "/login")}
