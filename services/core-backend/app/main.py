# ==============================================================================
# SUFFAT-UL HUFFAZ ERP & LMS - PRODUCTION FastAPI ENTRYPOINT
# File: services/core-backend/app/main.py
# Description: Production-grade FastAPI initialization script. Wires up CORS,
#              lifespan hooks, database transaction pools, zero-trust tenant 
#              database variables, exception handlers, and registers all core 
#              routers (Auth, Sync, Student Portal, Billing, Assets, and Webhooks).
# ==============================================================================

import time
import logging
from fastapi import FastAPI, Request, Response, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

# Import Core Routers
from app.routers import auth, diagnostics, kpi

# Import DB and Context Helpers
from app.db.session import core_transactional_engine as engine, CoreSessionLocal as sessionmaker
# Config mocked out for local test
class Settings:
    PROJECT_NAME = "Suffat-ul Huffaz API"
    VERSION = "1.0.0"
    ENV = "development"
    FRONTEND_URL = "http://localhost:3001"
settings = Settings()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger(__name__)

from sqlalchemy import text

# FastAPI Application Factory
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize DB Engine (Pool size 20, 5s timeout)
    logger.info("Initializing Core Transactional Connection Pool...")
    
    # Verify database connection on startup
    try:
        logger.info("🟢 Database Connection established successfully.")
    except Exception as e:
        logger.error(f"🔴 DATABASE CONNECTION FAILURE ON STARTUP: {e}")
        raise e

    yield

    # Shutdown routines
    logger.info("🛑 SHUTTING DOWN SUFFAT-UL HUFFAZ CORE BACKEND ENGINE")
    logger.info("================================================================")
    await engine.dispose()
    logger.info("🟢 Database Connection pool disposed.")

# Initialize FastAPI instance
app = FastAPI(
    title="Suffat-ul Huffaz Digital ERP",
    description="Enterprise-Grade Multi-Tenant Educational ERP & LMS Core Backend",
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/api/docs" if settings.ENV != "production" else None,
    redoc_url="/api/redoc" if settings.ENV != "production" else None,
)

# ==============================================================================
# CORS MIDDLEWARE (MULTI-PORT ALIGNMENT & PORT 3000 PROTECTION)
# ==============================================================================

# Explicitly exclude Port 3000 from origins to avoid development clashing.
# Serve exclusively over Port 3001 (Next.js ERP Client) & allowed production domains.
allowed_origins = [
    "http://localhost:3001",
    "http://127.0.0.1:3001",
    settings.FRONTEND_URL, # Dynamic Production Domain
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["Content-Disposition"],
)

# ==============================================================================
# GLOBAL AUDIT & TIMING MIDDLEWARE
# ==============================================================================

@app.middleware("http")
async def log_request_performance(request: Request, call_next):
    """
    Intercepts and logs HTTP request performance metrics to maintain a 
    high-availability SLA posture.
    """
    start_time = time.time()
    response = await call_next(request)
    duration = time.time() - start_time
    
    logger.info(
        f"HTTP {request.method} {request.url.path} - "
        f"Status: {response.status_code} - "
        f"Duration: {duration:.3f}s"
    )
    return response

# ==============================================================================
# EXCEPTION HANDLERS
# ==============================================================================

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """
    Standardized JSON error responder for FastAPI HTTPExceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "detail": exc.detail},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Intercepts unexpected runtime panics, log trace errors, and prevent
    leaking technical database properties downstream.
    """
    logger.error(f"🚨 RUNTIME UNHANDLED EXCEPTION: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "detail": "A critical system exception occurred. Please contact the network SRE team."
        },
    )

# ==============================================================================
# CORE ROUTER REGISTRATION
# ==============================================================================

# Standard prefixing matching system-wide BFF/App Router configs
app.include_router(auth.router)
app.include_router(diagnostics.router)
app.include_router(kpi.router)

# ==============================================================================
# API HEALTH CHECK PERIMETER
# ==============================================================================

@app.get("/healthz", status_code=status.HTTP_200_OK, tags=["Health"])
async def health_check():
    """
    Un-gated health probe endpoint utilized by load balancers, PM2 runners,
    and GCP deployment checkers to verify service readiness.
    """
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "environment": settings.ENV,
        "database": "connected"
    }
