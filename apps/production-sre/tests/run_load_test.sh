#!/bin/bash
# Location: apps/production-sre/tests/run_load_test.sh

echo "Bootstrapping k6 load performance container..."
docker run --rm -i grafana/k6 run - < apps/production-sre/tests/load-profile-k6.js
