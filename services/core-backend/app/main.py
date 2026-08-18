from fastapi import FastAPI
from app.core.middleware.tenant_interceptor import TenantInterceptorMiddleware
from app.core.middleware.cors_sec import setup_cors

app = FastAPI(title="Suffat-ul Huffaz Core API", version="1.0.0")

from app.routers import admissions, sync, whatsapp_webhook, auth, academic, billing, affiliation, alumni, competition, reports, asset, telemetry, branding

setup_cors(app)
app.add_middleware(TenantInterceptorMiddleware)

app.include_router(auth.router)
app.include_router(academic.router)
app.include_router(admissions.router)
app.include_router(billing.router)
app.include_router(sync.router)
app.include_router(whatsapp_webhook.router)
app.include_router(affiliation.router)
app.include_router(alumni.router)
app.include_router(competition.router)
app.include_router(reports.router)
app.include_router(asset.router)
app.include_router(telemetry.router)
app.include_router(branding.router)

@app.get("/health")
def health_check():
    return {"status": "ok"}
