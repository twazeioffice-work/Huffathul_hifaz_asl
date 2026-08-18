-- Local Edge Node SQLite schema for offline resilience
CREATE TABLE IF NOT EXISTS local_sync_ledger (
    local_id INTEGER PRIMARY KEY AUTOINCREMENT,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    payload_blob BLOB NOT NULL,
    is_synced BOOLEAN DEFAULT 0,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_is_synced ON local_sync_ledger(is_synced);
