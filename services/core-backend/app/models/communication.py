# Location: services/core-backend/app/models/communication.py
import enum
import uuid
from sqlalchemy import Column, String, Enum, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class MessageDirection(str, enum.Enum):
    INBOUND = "inbound"
    OUTBOUND = "outbound"

class MessageStatus(str, enum.Enum):
    RECEIVED = "received"
    SENT = "sent"
    DELIVERED = "delivered"
    READ = "read"
    FAILED = "failed"

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="SET NULL"), nullable=True)
    sender_phone = Column(String(32), nullable=False)
    recipient_phone = Column(String(32), nullable=False)
    direction = Column(Enum(MessageDirection, name="message_direction", create_type=False), nullable=False)
    status = Column(Enum(MessageStatus, name="message_status", create_type=False), default=MessageStatus.RECEIVED, nullable=False)
    message_body = Column(Text, nullable=True)
    whatsapp_message_id = Column(String(128), unique=True, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
