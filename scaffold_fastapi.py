import os
import subprocess

BASE_DIR = r"E:\Huffathul Hifaaz_asl\apps\backend-erp"
SRC_DIR = os.path.join(BASE_DIR, "src")

DIRS = [
    os.path.join(SRC_DIR, "core"),
    os.path.join(SRC_DIR, "db"),
    os.path.join(SRC_DIR, "api", "v1"),
]

for d in DIRS:
    os.makedirs(d, exist_ok=True)

# 1. requirements.txt
reqs = """fastapi==0.110.0
uvicorn==0.27.1
sqlalchemy==2.0.28
pydantic==2.6.4
PyJWT==2.8.0
passlib==1.7.4
bcrypt==4.1.2
"""
with open(os.path.join(BASE_DIR, "requirements.txt"), "w") as f:
    f.write(reqs)

# 2. security.py
security_code = """from datetime import datetime, timedelta
from passlib.context import CryptContext
import jwt

SECRET_KEY = "supersecretkey"  # Matches frontend Next.js JWT_SECRET
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(hours=2)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
"""
with open(os.path.join(SRC_DIR, "core", "security.py"), "w") as f:
    f.write(security_code)

# 3. models.py
models_code = """from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Tenant(Base):
    __tablename__ = "tenants"
    id = Column(Integer, primary_key=True, index=True)
    institution_code = Column(String, unique=True, index=True)
    name = Column(String)

class Branch(Base):
    __tablename__ = "branches"
    id = Column(Integer, primary_key=True, index=True)
    tenant_id = Column(Integer, ForeignKey("tenants.id"))
    branch_code = Column(String, index=True)
    name = Column(String)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String)  # SUPER_ADMIN, CENTER_ADMIN, NAZIM, USTAD, STUDENT, PARENT
    tenant_id = Column(Integer, ForeignKey("tenants.id"), nullable=True)
    branch_id = Column(Integer, ForeignKey("branches.id"), nullable=True)
"""
with open(os.path.join(SRC_DIR, "db", "models.py"), "w") as f:
    f.write(models_code)

# 4. database.py
db_code = """from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.db.models import Base

SQLALCHEMY_DATABASE_URL = "sqlite:///./suffat_erp_dev.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
"""
with open(os.path.join(SRC_DIR, "db", "database.py"), "w") as f:
    f.write(db_code)

# 5. auth.py
auth_code = """from fastapi import APIRouter, Depends, HTTPException, Response
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
"""
with open(os.path.join(SRC_DIR, "api", "v1", "auth.py"), "w") as f:
    f.write(auth_code)

# 6. main.py
main_code = """from fastapi import FastAPI
from src.api.v1 import auth
from src.db.database import engine
from src.db.models import Base
from fastapi.middleware.cors import CORSMiddleware

# Auto-generate SQLite tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Huffathul Hifaaz ERP Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3005"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/healthz")
def health_check():
    return {"status": "ok"}
"""
with open(os.path.join(SRC_DIR, "main.py"), "w") as f:
    f.write(main_code)

# 7. init_db.py
init_db_code = """from src.db.database import SessionLocal, engine
from src.db.models import Base, User, Tenant, Branch
from src.core.security import get_password_hash

def init_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    hq = Tenant(institution_code="suffat-hq", name="Suffat HQ")
    suffat = Tenant(institution_code="suffat", name="Suffat Academy")
    db.add(hq)
    db.add(suffat)
    db.commit()
    
    hq_main = Branch(tenant_id=hq.id, branch_code="main", name="HQ Main")
    suffat_main = Branch(tenant_id=suffat.id, branch_code="main", name="Suffat Main")
    db.add(hq_main)
    db.add(suffat_main)
    db.commit()
    
    users = [
        User(email="admin@suffat.org", hashed_password=get_password_hash("password123"), role="SUPER_ADMIN", tenant_id=hq.id, branch_id=hq_main.id),
        User(email="admin_aa59cbc5f3@suffat.com", hashed_password=get_password_hash("password123"), role="CENTER_ADMIN", tenant_id=suffat.id, branch_id=suffat_main.id),
        User(email="manager@suffat.com", hashed_password=get_password_hash("password123"), role="NAZIM", tenant_id=suffat.id, branch_id=suffat_main.id),
        User(email="usthad_51c88a81db@suffat.com", hashed_password=get_password_hash("password123"), role="USTAD", tenant_id=suffat.id, branch_id=suffat_main.id)
    ]
    
    db.add_all(users)
    db.commit()
    db.close()
    print("Database seeded successfully with test credentials.")

if __name__ == "__main__":
    init_db()
"""
with open(os.path.join(BASE_DIR, "init_db.py"), "w") as f:
    f.write(init_db_code)

print("Backend scaffolding completed.")
