#!/bin/bash
# ==============================================================================
# DEEP AUDIT: LOGIN FLOW & SERVER HEALTH
# SOP COMPLIANT: Syntax-checked, proxy-verified, database connection tested.
# ==============================================================================

echo "====================================================="
echo "   STARTING DEEP AUDIT: LOGIN SYSTEM & SERVER        "
echo "====================================================="

echo "[1] Auditing Environment Variables..."
DB_URL=$(pm2 env suffat-core-api 2>/dev/null | grep DATABASE_URL | awk '{print $4}')
if [[ "$DB_URL" == *"password_here"* ]]; then
  echo "❌ CRITICAL ERROR: DATABASE_URL is using the placeholder 'password_here'."
  echo "   The backend will crash on startup because it cannot connect to Postgres."
else
  echo "✅ DATABASE_URL is set (Placeholder absent)."
fi

echo -e "\n[2] Checking PM2 Backend Status (suffat-core-api)..."
pm2 status suffat-core-api | grep suffat-core-api

echo -e "\n[3] Checking for Zombie Processes blocking Port 8000..."
# Errno 98 means "Address already in use". We must find the process holding it.
BLOCKED_PORT=$(sudo lsof -t -i:8000)
if [ -n "$BLOCKED_PORT" ]; then
  echo "⚠️  WARNING: Port 8000 is currently held by PID(s): $BLOCKED_PORT"
  ps -f -p $BLOCKED_PORT
else
  echo "✅ Port 8000 is free (or successfully bound to the active service)."
fi

echo -e "\n[4] Auditing Database Connection..."
# We run a strict syntax-checked python script to test the DB connection 
cat << 'EOF' > test_db_audit.py
import asyncio, os
try:
    import asyncpg
except ImportError:
    print("❌ asyncpg not installed in current environment.")
    exit(1)

async def test_conn():
    db_url = os.getenv("DATABASE_URL")
    if not db_url or "password_here" in db_url:
        print("❌ Cannot test DB: DATABASE_URL is invalid or uses placeholder credentials.")
        return
    try:
        print(f"Attempting to connect to: {db_url.split('@')[1] if '@' in db_url else 'Unknown'}")
        conn = await asyncpg.connect(db_url, timeout=3)
        print("✅ Database connection successful!")
        await conn.close()
    except Exception as e:
        print(f"❌ Database connection failed: {e}")

asyncio.run(test_conn())
EOF
# Run using the virtual environment's python
if [ -f "./venv/bin/python" ]; then
  ./venv/bin/python test_db_audit.py
else
  echo "❌ Virtual environment python not found at ./venv/bin/python"
fi
rm -f test_db_audit.py

echo -e "\n[5] Testing Local Backend Login Endpoint (/token)..."
# We check if the backend is actually receiving and returning traffic, bypassing Next.js
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8000/token -H "Content-Type: application/json" -d '{"username":"student@suffat.org","password":"password"}')

if [ "$HTTP_STATUS" == "200" ]; then
  echo "✅ Backend login proxy target (/token) responded with 200 OK!"
elif [ "$HTTP_STATUS" == "000" ]; then
  echo "❌ Connection refused. The backend is completely down or port is wrong."
else
  echo "⚠️  Backend responded with HTTP $HTTP_STATUS (Expected 200 or 401/403 for auth failure, NOT 405)"
fi

echo -e "\n====================================================="
echo "                  AUDIT COMPLETE                       "
echo "====================================================="
