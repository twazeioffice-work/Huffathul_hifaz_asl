import os
import hashlib
import base64
import hmac
import jwt
from datetime import datetime, timedelta, timezone
from typing import Dict, Any, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

SECRET_KEY = os.getenv("JWT_SECRET_KEY", "suffat-super-secure-jwt-hmac-secret-key-32bytes")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Scrypt parameter blocks matching modern cryptographic strength
SCRYPT_N = 16384
SCRYPT_R = 8
SCRYPT_P = 1

def hash_password(password: str) -> str:
    """
    Hashes a password using standard memory-hard scrypt key derivation.
    Returns format: $scrypt$n=16384,r=8,p=1$salt_b64$hash_b64
    """
    salt = os.urandom(16)
    hashed_bytes = hashlib.scrypt(
        password.encode("utf-8"),
        salt=salt,
        n=SCRYPT_N,
        r=SCRYPT_R,
        p=SCRYPT_P,
        dklen=64
    )
    salt_b64 = base64.b64encode(salt).decode("utf-8")
    hash_b64 = base64.b64encode(hashed_bytes).decode("utf-8")
    return f"$scrypt$n={SCRYPT_N},r={SCRYPT_R},p={SCRYPT_P}${salt_b64}${hash_b64}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verifies a plain password against the standard scrypt hash format.
    """
    if not hashed_password.startswith("$scrypt$"):
        return False
    try:
        parts = hashed_password.split("$")
        # parts: ["", "scrypt", "n=16384,r=8,p=1", "salt_b64", "hash_b64"]
        params_str = parts[2]
        salt_b64 = parts[3]
        hash_b64 = parts[4]
        
        # Parse params
        params = dict(param.split("=") for param in params_str.split(","))
        n = int(params.get("n", SCRYPT_N))
        r = int(params.get("r", SCRYPT_R))
        p = int(params.get("p", SCRYPT_P))
        
        salt = base64.b64decode(salt_b64)
        expected_hash = base64.b64decode(hash_b64)
        
        candidate_hash = hashlib.scrypt(
            plain_password.encode("utf-8"),
            salt=salt,
            n=n,
            r=r,
            p=p,
            dklen=64
        )
        return hmac.compare_digest(candidate_hash, expected_hash)
    except Exception:
        return False

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    """
    Generates a cryptographically signed Access JWT including scopes and roles.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: Dict[str, Any]) -> str:
    """
    Generates a cryptographically signed Refresh JWT.
    """
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "refresh": True})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> Dict[str, Any]:
    """
    Decodes and validates a signed JWT token.
    Raises jwt.ExpiredSignatureError or jwt.InvalidTokenError if invalid.
    """
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

security_scheme = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security_scheme)):
    try:
        payload = decode_token(credentials.credentials)
        return {
            "id": payload.get("sub"),
            "role": payload.get("role"),
            "tenant_id": payload.get("tenant_id")
        }
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def set_db_tenant_context(db: AsyncSession, tenant_id: Optional[str], role: str = "USTAD"):
    if tenant_id:
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
