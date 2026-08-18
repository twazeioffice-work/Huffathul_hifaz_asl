#!/bin/bash
# Location: apps/public-website/tests/rate_limit_test.sh

TARGET_URL="${TEST_TARGET_URL:-http://localhost:3001/api/admission-ingest}"
MOCK_IP="192.168.12.84"

echo "Running rate-limiter validation check on admission proxy against $TARGET_URL..."

for i in {1..6}
do
  RESPONSE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$TARGET_URL" \
    -H "Content-Type: application/json" \
    -H "X-Forwarded-For: $MOCK_IP" \
    -d '{"full_name": "Attacker Bot", "email": "bot@attack.com", "phone_number": "+919876543210"}')
    
  echo "Attempt $i: Status Code $RESPONSE_STATUS received"

  if [ "$i" -le 5 ]; then
    if [ "$RESPONSE_STATUS" -eq 429 ]; then
      echo "ERROR: Premature rate limiting on attempt $i!"
      exit 1
    fi
  fi

  if [ "$i" -eq 6 ]; then
    if [ "$RESPONSE_STATUS" -eq 429 ]; then
      echo "SUCCESS: Rate limiter successfully triggered on Attempt 6 with 429 Too Many Requests."
      exit 0
    else
      echo "SECURITY VULNERABILITY DETECTED: Expected 429 but received $RESPONSE_STATUS on Attempt 6!"
      exit 1
    fi
  fi
done
