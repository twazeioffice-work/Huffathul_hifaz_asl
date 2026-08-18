from datetime import datetime

class MessageLogMock:
    """
    DDL Mock for storing raw conversational logs and auditing.
    """
    def __init__(self, message_id: str, wa_id: str, direction: str, content: str):
        self.message_id = message_id
        self.wa_id = wa_id           # WhatsApp Phone Number
        self.direction = direction   # 'INBOUND' or 'OUTBOUND'
        self.content = content
        self.timestamp = datetime.utcnow()
        self.tenant_id = None        # Resolved later by InboundProcessor
