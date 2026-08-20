from app.models.lms import LMSOfflineSyncEngine
from datetime import datetime, timezone

def sync_push_endpoint(client_pushes: list, mock_server_db: dict):
    """
    FastAPI Router Mock: POST /api/v1/sync/push
    """
    # Extract server timestamps for the incoming records
    server_timestamps = {
        k: v['last_modified_at'] for k, v in mock_server_db.items() if k in [p['id'] for p in client_pushes]
    }
    
    resolved = LMSOfflineSyncEngine.resolve_push_conflicts(server_timestamps, client_pushes)
    
    # Apply resolved updates to database
    for record in resolved:
        mock_server_db[record['id']] = record
        
    return {"status": "success", "applied_records": len(resolved)}
