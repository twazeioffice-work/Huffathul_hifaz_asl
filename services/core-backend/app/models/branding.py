# Location: services/core-backend/app/models/branding.py
import enum
import uuid
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Boolean
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base

class TenantThemeMode(str, enum.Enum):
    DARK = "dark"
    LIGHT = "light"
    CUSTOM = "custom"

class TenantBrandingConfig(Base):
    __tablename__ = "tenant_branding_configs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False, unique=True)
    theme_mode = Column(Enum(TenantThemeMode, name="tenant_theme_mode", create_type=False), default=TenantThemeMode.LIGHT, nullable=False)
    primary_color = Column(String(7), default="#0D9488", nullable=False)
    background_color = Column(String(7), default="#FAF9F6", nullable=False)
    text_color = Column(String(7), default="#1A202C", nullable=False)
    logo_url = Column(String(512), nullable=False)
    favicon_url = Column(String(512), nullable=True)
    module_toggles = Column(JSONB, default={"lms": True, "transport": False}, nullable=False)
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class TenantCustomDomain(Base):
    __tablename__ = "tenant_custom_domains"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    custom_domain = Column(String(255), unique=True, nullable=False)
    verification_token = Column(String(64), nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    verified_at = Column(DateTime(timezone=True), nullable=True)
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
