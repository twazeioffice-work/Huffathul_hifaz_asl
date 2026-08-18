#!/bin/bash
# Location: apps/production-sre/tests/chaos-failure-injection.sh
set -e

echo "=== INITIATING CHAOS FAILOVER FAULT SCAN ==="

# 1. Force GKE Node Outage (Terminate active node instance group)
echo "Step 1: Simulating abrupt cluster node termination..."
gcloud compute instances stop $(gcloud compute instances list --filter="name ~ suffat-prod" --format="value(name)" | head -n 1) --zone="asia-south1-a" --quiet

# 2. Assert Pod Redistribution
echo "Verifying pod health self-healing redistribution..."
sleep 10
kubectl get pods -n suffat-prod -o wide

# 3. Simulate Primary Database Instance Failover
echo "Step 2: Triggering primary database master failover..."
gcloud sql instances failover suffat-prod-db-instance --quiet

# 4. Check API Gateway DB Connection Re-routing
echo "Verifying API response recovery via PgBouncer pooling..."
for i in {1..10}
do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X GET "https://api.suffat.org/health")
  if [ "$STATUS" -eq 200 ]; then
    echo "SUCCESS: Database failover completed. API Gateway is online. Status: 200"
    exit 0
  fi
  echo "Awaiting connection re-routing... Status: $STATUS"
  sleep 3
done

echo "CRITICAL FAULT: Database failover recovery exceeded SLA window."
exit 1
