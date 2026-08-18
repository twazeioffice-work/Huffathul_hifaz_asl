#!/bin/bash
# Location: apps/production-ops/scripts/hotfixes/hotfix_apply.sh
set -euo pipefail

DB_HOST=${DB_HOST:-"127.0.0.1"}
DB_PORT=${DB_PORT:-"5432"}
DB_NAME=${DB_NAME:-"suffat_erp_prod"}
DB_USER=${DB_USER:-"postgres"}

HOTFIX_FILE=$1

if [ -z "$HOTFIX_FILE" ]; then
    echo "Usage: $0 <path_to_hotfix.sql>"
    exit 1
fi

echo "=== INITIALIZING SECURITY HOT-PATCH TRANSITION LOOP ==="
echo "Target Database: $DB_NAME on $DB_HOST:$DB_PORT"

# Use PostgreSQL transaction blocks with SET LOCK_TIMEOUT to prevent indefinite table locks
# Lock timeout set to 2 seconds to avoid blocking live multi-tenant traffic
PGPASSWORD="${DB_PASSWORD:-postgres}" psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 <<EOF
SET lock_timeout = '2000';
BEGIN;
    SAVEPOINT before_hotfix;
    
    -- Inject the hotfix payload
    \i $HOTFIX_FILE
    
    -- Assert no unbalanced ledger lines or empty schemas were created
    SELECT CASE 
        WHEN EXISTS (
            SELECT 1 FROM information_schema.tables WHERE table_name = 'voucher_lines'
        ) THEN (
            SELECT CASE 
                WHEN ABS(SUM(debit) - SUM(credit)) > 0 THEN 1/0 -- Forces exception and rollback
                ELSE 0 
            END FROM voucher_lines
        )
        ELSE 0
    END;
    
    RELEASE SAVEPOINT before_hotfix;
COMMIT;
EOF

if [ $? -eq 0 ]; then
    echo "SUCCESS: Emergency hot-patch applied and committed cleanly."
    exit 0
else
    echo "CRITICAL FAULT: Hot-patch execution exceeded safe lock limits or violated relational constraints."
    echo "PostgreSQL issued an automatic ROLLBACK to preserve state."
    exit 1
fi
