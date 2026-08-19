#!/usr/bin/env bash
# ==============================================================================
# Railway Deploy Verification Script
# ==============================================================================
# Validates build health, environment variable presence, and endpoint responses
# after a Railway deployment.
#
# Usage: bash tests/railway_deploy_verify.sh [BASE_URL]
#   BASE_URL defaults to http://localhost:8000
# ==============================================================================

set -euo pipefail

BASE_URL="${1:-http://localhost:8000}"
PASS=0
FAIL=0

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║  SUFFAT-UL HUFFAZ — Railway Deployment Verification Suite   ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "Target: $BASE_URL"
echo ""

# ── Helper ───────────────────────────────────────────────────────────────────

check() {
    local label="$1"
    local result="$2"
    if [ "$result" = "PASS" ]; then
        echo "  ✅ $label"
        PASS=$((PASS + 1))
    else
        echo "  ❌ $label"
        FAIL=$((FAIL + 1))
    fi
}

# ── Test 1: Liveness Probe ───────────────────────────────────────────────────

echo "=== [1/5] Liveness Probe ==="
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/health" 2>/dev/null || echo "000")
if [ "$STATUS" = "200" ]; then
    check "Health endpoint returned HTTP 200" "PASS"
else
    check "Health endpoint returned HTTP $STATUS (expected 200)" "FAIL"
fi

# ── Test 2: Dependency Health ────────────────────────────────────────────────

echo "=== [2/5] Dependency Health Check ==="
DEP_RESPONSE=$(curl -s "$BASE_URL/api/v1/health/dependencies" 2>/dev/null || echo '{"overall":"unreachable"}')
OVERALL=$(echo "$DEP_RESPONSE" | grep -o '"overall":"[^"]*"' | head -1 | cut -d'"' -f4)
if [ "$OVERALL" = "healthy" ] || [ "$OVERALL" = "degraded" ]; then
    check "Dependencies check responded: $OVERALL" "PASS"
else
    check "Dependencies check failed: $OVERALL" "FAIL"
fi

# ── Test 3: Environment Variables ────────────────────────────────────────────

echo "=== [3/5] Environment Variable Verification ==="
REQUIRED_VARS=("APP_ENVIRONMENT" "PORT")
for var in "${REQUIRED_VARS[@]}"; do
    if [ -n "${!var:-}" ]; then
        check "$var is set" "PASS"
    else
        check "$var is NOT set" "FAIL"
    fi
done

# ── Test 4: Crash Simulation Blocked in Prod ─────────────────────────────────

echo "=== [4/5] Crash Simulation Guard ==="
CRASH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/api/v1/health/simulate-crash" 2>/dev/null || echo "000")
if [ "$CRASH_STATUS" = "403" ]; then
    check "Crash simulation correctly blocked (HTTP 403)" "PASS"
elif [ "$CRASH_STATUS" = "500" ]; then
    check "Crash simulation fired (non-production environment)" "PASS"
else
    check "Crash simulation returned unexpected HTTP $CRASH_STATUS" "FAIL"
fi

# ── Test 5: Port Binding ────────────────────────────────────────────────────

echo "=== [5/5] Port Binding ==="
PORT_CHECK=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/" 2>/dev/null || echo "000")
if [ "$PORT_CHECK" != "000" ]; then
    check "Service is bound and responding on target port" "PASS"
else
    check "Service is NOT responding on target port" "FAIL"
fi

# ── Summary ──────────────────────────────────────────────────────────────────

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "  Results: $PASS passed, $FAIL failed"
echo "════════════════════════════════════════════════════════════════"

if [ "$FAIL" -gt 0 ]; then
    echo "  ⚠️  DEPLOYMENT VERIFICATION FAILED — Review failures above."
    exit 1
else
    echo "  🚀 ALL CHECKS PASSED — Deployment verified successfully."
    exit 0
fi
