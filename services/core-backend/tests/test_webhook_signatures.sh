#!/bin/bash
# Location: services/core-backend/tests/test_webhook_signatures.sh

TARGET_URL="http://localhost:8000/api/v1/webhooks/whatsapp"

echo "Testing webhook endpoint signature forgery..."

# Dispatch forged payload with invalid HMAC signature header
STATUS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST $TARGET_URL \
  -H "Content-Type: application/json" \
  -H "X-Hub-Signature-256: sha256=invalid_hash_value" \
  -d '{"object": "whatsapp_business_account", "entry": []}')

if [ "$STATUS_CODE" -eq 401 ]; then
  echo "SUCCESS: Spoofed webhook handshake blocked. Status: 401 Unauthorized"
  exit 0
else
  echo "CRITICAL VULNERABILITY: Gateway processed webhook with forged signature. Status: $STATUS_CODE"
  exit 1
fi
