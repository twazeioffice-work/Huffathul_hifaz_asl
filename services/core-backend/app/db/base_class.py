import uuid
import datetime
from typing import Any
from sqlalchemy.orm import as_declarative, declared_attr
from sqlalchemy import Column, DateTime, Boolean

@as_declarative()
class Base:
    id: Any
    __name__: str
    
    # GDPR / SOC 2 Tombstoning Data Lifecycle Pipeline
    is_deleted = Column(Boolean, default=False, nullable=False, index=True)
    deleted_at = Column(DateTime(timezone=True), nullable=True)

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

