from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://suffat_admin:suffat_password@localhost:5432/suffat_erp")

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Mock async session for Phase 2 compatibility
class MockTransaction:
    async def __aenter__(self): return self
    async def __aexit__(self, exc_type, exc, tb): pass

class MockAsyncSession:
    async def __aenter__(self): return self
    async def __aexit__(self, exc_type, exc, tb): pass
    def begin(self): return MockTransaction()
    async def execute(self, stmt): return type('MockResult', (), {'scalar_one_or_none': lambda: None, 'scalars': lambda: type('MockScalars', (), {'all': lambda: []})()})()
    def add(self, obj): pass
    async def flush(self): pass
    async def commit(self): pass

async def get_db_session():
    yield MockAsyncSession()

def async_session_maker():
    return MockAsyncSession()
