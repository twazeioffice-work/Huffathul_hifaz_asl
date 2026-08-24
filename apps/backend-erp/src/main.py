from fastapi import FastAPI
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
