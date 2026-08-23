import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime, ForeignKey, text
from sqlalchemy.dialects.postgresql import UUID, JSONB, ENUM
from app.db.base_class import Base
from sqlalchemy.sql import func

class CommunicationLog(Base):
    __tablename__ = "communication_logs"
    __table_args__ = {'extend_existing': True}

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()"))
    institution_id = Column(UUID(as_uuid=True), ForeignKey("institutions.id", ondelete="CASCADE"), nullable=False)
    branch_id = Column(UUID(as_uuid=True), ForeignKey("branches.id", ondelete="CASCADE"), nullable=False)
    student_profile_id = Column(UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="SET NULL"), nullable=True)
    staff_profile_id = Column(UUID(as_uuid=True), ForeignKey("staff_profiles.id", ondelete="SET NULL"), nullable=True)
    
    whatsapp_message_id = Column(String(255), unique=True, nullable=False)
    sender_phone = Column(String(32), nullable=False, index=True)
    receiver_phone = Column(String(32), nullable=False)
    
    direction = Column(ENUM('inbound', 'outbound', name='message_direction', create_type=False), nullable=False)
    status = Column(ENUM('received', 'sent', 'delivered', 'read', 'failed', name='message_status', create_type=False), nullable=False, default='received')
    
    message_body = Column(Text, nullable=False)
    raw_payload = Column(JSONB, nullable=False, default={})
    is_automated_response = Column(Boolean, nullable=False, default=False)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False)
