# Location: services/core-backend/app/models/asset.py
import enum
import uuid
from sqlalchemy import Column, String, Integer, Numeric, Enum, DateTime, Date, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.sql import func
from app.db.base_class import Base

class AssetStatus(str, enum.Enum):
    ACTIVE = "active"
    DECOMMISSIONED = "decommissioned"
    MAINTENANCE = "maintenance"
    DISPOSED = "disposed"

class DepreciationMethod(str, enum.Enum):
    STRAIGHT_LINE = "straight_line"
    DOUBLE_DECLINING = "double_declining"

class AssetCategory(Base):
    __tablename__ = "asset_categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    code = Column(String(32), nullable=False)
    name = Column(String(128), nullable=False)
    useful_life_years = Column(Integer, nullable=False)
    depr_method = Column(Enum(DepreciationMethod, name="depreciation_method", create_type=False), default=DepreciationMethod.STRAIGHT_LINE, nullable=False)
    salvage_value_percentage = Column(Numeric(5, 2), default=10.00)
    asset_account_head_id = Column(UUID(as_uuid=True), ForeignKey("account_heads.id", ondelete="RESTRICT"), nullable=False)
    depr_account_head_id = Column(UUID(as_uuid=True), ForeignKey("account_heads.id", ondelete="RESTRICT"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class Asset(Base):
    __tablename__ = "assets"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    category_id = Column(UUID(as_uuid=True), ForeignKey("asset_categories.id", ondelete="RESTRICT"), nullable=False)
    code = Column(String(64), nullable=False)
    name = Column(String(255), nullable=False)
    acquisition_date = Column(Date, nullable=False)
    acquisition_cost = Column(Numeric(12, 2), nullable=False)
    current_book_value = Column(Numeric(12, 2), nullable=False)
    salvage_value = Column(Numeric(12, 2), nullable=False)
    status = Column(Enum(AssetStatus, name="asset_status", create_type=False), default=AssetStatus.ACTIVE, nullable=False)
    metadata_ = Column("metadata", JSONB, default={}, nullable=False)
    tracker_token = Column(String(128), nullable=True)
    last_modified_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class AssetMaintenanceLog(Base):
    __tablename__ = "asset_maintenance_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    service_date = Column(Date, nullable=False)
    cost = Column(Numeric(12, 2), default=0.00, nullable=False)
    description = Column(Text, nullable=False)
    performed_by = Column(String(128), nullable=False)
    next_scheduled_service = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

class GpsTelemetryLog(Base):
    __tablename__ = "gps_telemetry_logs"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    asset_id = Column(UUID(as_uuid=True), ForeignKey("assets.id", ondelete="CASCADE"), nullable=False)
    timestamp = Column(DateTime(timezone=True), nullable=False)
    latitude = Column(Numeric(9, 6), nullable=False)
    longitude = Column(Numeric(9, 6), nullable=False)
    speed_kmh = Column(Numeric(5, 2), nullable=False)
    heading = Column(Integer, nullable=False)
