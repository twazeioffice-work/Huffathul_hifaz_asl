import re
from fastapi import Request, HTTPException, status
from starlette.middleware.base import BaseHTTPMiddleware
from app.db.session import SessionLocal

# Mock JWT decode function until Security wrapper is built
def decode_access_jwt(token: str):
    return {"tenants": [{"inst_code": "suh01", "br_code": "mn01", "inst_id": "00000000-0000-0000-0000-000000000000"}]}

class JWTValidationError(Exception):
    pass

class TenantInterceptorMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if request.url.path.startswith("/api/v1/auth") or request.url.path == "/health":
            return await call_next(request)
        
        match = re.match(r"^/api/v1/app/([^/]+)/([^/]+)/", request.url.path)
        if not match:
            # Not an app route or malformed
            return await call_next(request)
        
        url_inst_code, url_branch_code = match.group(1), match.group(2)
        
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return await call_next(request) # Let auth dependencies handle 401s if needed, or raise here
        
        token = auth_header.split(" ")[1]
        try:
            claims = decode_access_jwt(token)
        except JWTValidationError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session credentials."
            )
            
        user_tenants = claims.get("tenants", [])
        
        authorized = False
        target_institution_id = None
        for tenant in user_tenants:
            if (tenant["inst_code"].lower() == url_inst_code.lower() and 
                tenant["br_code"].lower() == url_branch_code.lower()):
                authorized = True
                target_institution_id = tenant["inst_id"]
                break
                
        if not authorized:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied. You do not belong to this institution or branch context."
            )
            
        db = SessionLocal()
        try:
            db.execute(sa.text(f"SET app.current_tenant_id = '{target_institution_id}';"))
            request.state.db = db
            response = await call_next(request)
            return response
        finally:
            db.close()
