import pytest
from datetime import datetime, timezone, timedelta
from app.models.lms import LMSOfflineSyncEngine
from app.routers.sync import sync_push_endpoint

def test_sync_concurrency_lww():
    """
    Validation Gate: Ensures Last-Write-Wins (LWW) conflict resolution
    prevents stale offline client data from overwriting newer server data.
    """
    now = datetime.now(timezone.utc)
    old_time = now - timedelta(hours=2)
    
    mock_server_db = {
        "record_1": {"id": "record_1", "grade": "excellent", "last_modified_at": now}
    }
    
    # Client was offline for 3 hours, edits an old record and pushes it now
    client_pushes = [
        {"id": "record_1", "grade": "average", "last_modified_at": old_time}
    ]
    
    response = sync_push_endpoint(client_pushes, mock_server_db)
    
    # The server should REJECT the client push because server time > client time
    assert response["applied_records"] == 0
    assert mock_server_db["record_1"]["grade"] == "excellent" # Not overwritten

def test_sync_valid_update():
    """
    Validation Gate: Ensures fresh offline client data is accepted.
    """
    now = datetime.now(timezone.utc)
    new_time = now + timedelta(hours=1)
    
    mock_server_db = {
        "record_2": {"id": "record_2", "grade": "average", "last_modified_at": now}
    }
    
    # Client has a newer timestamp
    client_pushes = [
        {"id": "record_2", "grade": "excellent", "last_modified_at": new_time}
    ]
    
    response = sync_push_endpoint(client_pushes, mock_server_db)
    
    # Server accepts the update
    assert response["applied_records"] == 1
    assert mock_server_db["record_2"]["grade"] == "excellent"
