from typing import List, Dict
from datetime import datetime

class AssetStatus:
    ACTIVE = "ACTIVE"
    MAINTENANCE = "MAINTENANCE"
    DECOMMISSIONED = "DECOMMISSIONED"

class AssetModelMock:
    """
    Represents the SQLAlchemy physical ledger.
    """
    def __init__(self, asset_id: str, tenant_id: str, name: str, value: float):
        self.asset_id = asset_id
        self.tenant_id = tenant_id
        self.name = name
        self.value = value
        self.status = AssetStatus.ACTIVE

class TelemetryLogMock:
    """
    Mock mapping for GPS IoT coordinates for fleet vehicles.
    """
    def __init__(self, vehicle_id: str, lat: float, lng: float):
        self.vehicle_id = vehicle_id
        self.lat = lat
        self.lng = lng
        self.timestamp = datetime.utcnow()
