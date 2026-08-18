import uuid
from sqlalchemy import Column, String, DateTime, func, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from app.db.base_class import Base

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="SET NULL"), nullable=True)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="SET NULL"), nullable=True)
    student_profile_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="SET NULL"), nullable=True)
    staff_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    direction = Column(Enum('inbound', 'outbound', name='comm_direction'), nullable=False)
    status = Column(Enum('received', 'sent', 'delivered', 'read', 'failed', name='comm_status'), default='sent', nullable=False)
    sender_phone = Column(String(32), nullable=False)
    whatsapp_message_id = Column(String(128), unique=True, nullable=False)
    payload = Column(JSONB, default={}, nullable=False)
    created_at = Column(DateTime(timezone=True), default=func.now(), nullable=False)
