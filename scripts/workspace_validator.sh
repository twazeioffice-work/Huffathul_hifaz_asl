#!/bin/bash
# Location: scripts/workspace_validator.sh
set -e

echo "=== EXECUTING MONOREPO STRUCTURAL INTEGRITY AUDIT ==="

# 1. Assert Folder Exists
assert_directory() {
  if [ ! -d "$1" ]; then
    echo "CRITICAL ERROR: Topology path '$1' is missing."
    exit 1
  fi
}

assert_file() {
  if [ ! -f "$1" ]; then
    echo "CRITICAL ERROR: Configuration file '$1' is missing."
    exit 1
  fi
}

# 2. Run Checks
assert_directory "apps/internal-erp"
assert_directory "apps/public-website"
assert_directory "apps/ai-swarm-mcp"
assert_directory "packages/database"
assert_directory "scripts"
assert_directory "docs"

assert_file "package.json"
assert_file "pnpm-workspace.yaml"
assert_file "turbo.json"
assert_file "tsconfig.json"

# 3. Verify Turborepo Schema configuration
if grep -q "globalDependencies" turbo.json; then
  echo "SUCCESS: Turborepo pipeline caching rules validated."
else
  echo "ERROR: turbo.json is missing caching specifications."
  exit 1
fi

echo "=== SYSTEM ARCHITECTURE INTEGRITY PASSED ==="
exit 0
