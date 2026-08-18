from fastapi import FastAPI
from app.core.middleware.tenant_interceptor import TenantInterceptorMiddleware
from app.core.middleware.cors_sec import setup_cors

app = FastAPI(title="Suffat-ul Huffaz Core API", version="1.0.0")

from app.routers import admissions, sync, whatsapp_webhook

setup_cors(app)
app.add_middleware(TenantInterceptorMiddleware)

app.include_router(admissions.router)
app.include_router(sync.router)
app.include_router(whatsapp_webhook.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
