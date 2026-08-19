"""
================================================================================
SUFFAT-UL HUFFAZ - DORMANT EDGE MESH SQLALCHEMY MODELS (Phase 16)
================================================================================
ORM models mapping to PostgreSQL 16 dormant edge mesh tables.
Zero runtime footprint when dormant; fully prepared for multi-tenant offline sync.
================================================================================
"""

import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Integer,
    BigInteger,
    Text,
    LargeBinary,
    DateTime,
    ForeignKey,
    Index,
    Enum as SQLEnum
)
from sqlalchemy.dialects.postgresql import UUID, JSONB, CIDR
from sqlalchemy.orm import declarative_base, relationship
import enum

Base = declarative_base()

class EdgeNodeStatus(str, enum.Enum):
    DORMANT = "DORMANT"
    ACTIVE = "ACTIVE"
    DEGRADED = "DEGRADED"
    OFFLINE = "OFFLINE"

class SyncPayloadStatus(str, enum.Enum):
    PENDING = "PENDING"
    PROCESSING = "PROCESSING"
    SYNCHRONIZED = "SYNCHRONIZED"
    FAILED_CONFLICT = "FAILED_CONFLICT"
    FAILED_CORRUPT = "FAILED_CORRUPT"

class NetworkLinkType(str, enum.Enum):
    SATELLITE = "SATELLITE"
    CELLULAR = "CELLULAR"
    BROADBAND = "BROADBAND"
    OFFLINE_PHYSICAL = "OFFLINE_PHYSICAL"


class TenantEdgeNode(Base):
    __tablename__ = "tenant_edge_nodes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    branch_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    node_identifier = Column(String(100), unique=True, nullable=False)
    status = Column(SQLEnum(EdgeNodeStatus, name="edge_node_status"), default=EdgeNodeStatus.DORMANT)
    wireguard_public_key = Column(String(128), nullable=True)
    local_ip_range = Column(CIDR, nullable=True)
    uplink_type = Column(SQLEnum(NetworkLinkType, name="network_link_type"), default=NetworkLinkType.BROADBAND)

    hardware_specs = Column(JSONB, default={
        "cpu_cores": 4,
        "total_ram_mb": 8192,
        "flash_storage_gb": 128
    })
    live_telemetry = Column(JSONB, default={
        "cpu_usage_pct": 0,
        "ram_usage_pct": 0,
        "disk_free_pct": 100,
        "core_temp_celsius": 0.0,
        "wireguard_handshake_latency_ms": None
    })

    last_heartbeat = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    sync_queues = relationship("EdgeSyncQueue", back_populates="edge_node", cascade="all, delete-orphan")
    cache_manifests = relationship("LocalCacheManifest", back_populates="edge_node", cascade="all, delete-orphan")


class EdgeSyncQueue(Base):
    __tablename__ = "edge_sync_queue"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    node_id = Column(UUID(as_uuid=True), ForeignKey("tenant_edge_nodes.id", ondelete="CASCADE"), nullable=False)

    sequence_number = Column(BigInteger, nullable=False)
    protobuf_payload = Column(LargeBinary, nullable=False)
    payload_hash = Column(String(64), nullable=False)
    client_signature = Column(String(128), nullable=False)

    status = Column(SQLEnum(SyncPayloadStatus, name="sync_payload_status"), default=SyncPayloadStatus.PENDING)
    retry_count = Column(Integer, default=0)
    failure_log = Column(Text, nullable=True)

    synchronized_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    # Relationships
    edge_node = relationship("TenantEdgeNode", back_populates="sync_queues")


class LocalCacheManifest(Base):
    __tablename__ = "local_cache_manifest"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    tenant_id = Column(UUID(as_uuid=True), nullable=False, index=True)
    node_id = Column(UUID(as_uuid=True), ForeignKey("tenant_edge_nodes.id", ondelete="CASCADE"), nullable=False)
    cached_table = Column(String(100), nullable=False)
    last_known_hash = Column(String(64), nullable=False)
    total_records = Column(Integer, default=0)

    last_validated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationships
    edge_node = relationship("TenantEdgeNode", back_populates="cache_manifests")
