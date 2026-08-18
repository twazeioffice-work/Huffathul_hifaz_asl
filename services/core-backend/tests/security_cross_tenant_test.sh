#!/bin/bash
# Location: services/core-backend/tests/security_cross_tenant_test.sh

TOKEN_A=$(curl -s -X POST "https://api.suffat.org/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email": "user_a@suffat.org", "password": "SecurePassword123"}' | jq -r '.access_token')

echo "Acquired Session Token for User A: ${TOKEN_A:0:15}..."

echo "Initiating cross-tenant data breach query targeting Tenant SUH02..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET \
  "https://api.suffat.org/api/v1/app/suh02/mn01/erp/students" \
  -H "Authorization: Bearer $TOKEN_A")

if [ "$HTTP_STATUS" -eq 403 ]; then
  echo "SUCCESS: Cross-tenant data boundary breach prevented. Status: 403 Forbidden"
  exit 0
else
  echo "CRITICAL VULNERABILITY: Cross-tenant data boundary leakage detected. Status: $HTTP_STATUS"
  exit 1
fi
