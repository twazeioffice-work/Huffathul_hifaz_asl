from typing import List, Dict, Any
from datetime import datetime, timezone

class LMSOfflineSyncEngine:
    """
    Handles WatermelonDB conflict resolution and tombstone mapping.
    Uses Last-Write-Wins (LWW) based on server-side 'last_modified_at'.
    """
    @staticmethod
    def resolve_push_conflicts(server_records: Dict[str, datetime], client_pushes: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        resolved_updates = []
        for push in client_pushes:
            record_id = push['id']
            client_timestamp = push['last_modified_at']
            
            # If server has a newer record, reject the client's stale offline edit
            if record_id in server_records and server_records[record_id] > client_timestamp:
                continue 
            
            resolved_updates.append(push)
            
        return resolved_updates
