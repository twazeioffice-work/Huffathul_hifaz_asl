-- Enable performance features
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA foreign_keys = ON;

-- 1. LOCAL TRANSACTION QUEUE (Main sync ledger)
-- Capture operations locally. Marked with serial sequence and sync states.
CREATE TABLE local_sync_queue (
    sequence_id INTEGER PRIMARY KEY AUTOINCREMENT,
    transaction_uuid TEXT UNIQUE NOT NULL,      -- Unique client-side transaction ID
    institution_id TEXT NOT NULL,               -- Bound tenant reference
    branch_id TEXT NOT NULL,                    -- Bound branch reference
    operator_user_id TEXT NOT NULL,             -- Actor executing the write
    table_name TEXT NOT NULL,                   -- Target operational table: 'hifz_sabaq_records'
    action_type TEXT NOT NULL,                  -- 'INSERT', 'UPDATE', 'DELETE'
    record_uuid TEXT NOT NULL,                  -- Target database primary key in GCP
    payload_json TEXT NOT NULL,                 -- Complete payload metadata snapshot
    client_timestamp TEXT NOT NULL,             -- True client-side transaction time (ISO 8601 UTC)
    sync_status TEXT DEFAULT 'PENDING',         -- 'PENDING', 'PROCESSING', 'SYNCED'
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_queue_pending ON local_sync_queue(sync_status) WHERE sync_status = 'PENDING';
CREATE INDEX idx_queue_lookup ON local_sync_queue(table_name, record_uuid);

-- 2. LOCAL DEVICE CACHE METADATA
-- Holds lightweight local references to prevent database reads across the network.
CREATE TABLE local_cache_manifest (
    record_uuid TEXT PRIMARY KEY,
    table_name TEXT NOT NULL,
    data_payload TEXT NOT NULL,
    last_modified_at TEXT NOT NULL
);
