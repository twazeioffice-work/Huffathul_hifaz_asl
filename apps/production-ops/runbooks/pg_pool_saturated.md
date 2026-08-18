# SRE Runbook: Database Connection Pool Maxed Out
**Error Code Reference:** SUH-RUN-PG-01  
**Severity Level:** High (P1)  
**SLA Target Response:** < 10 Minutes  

## Impact Assessment
The transaction-mode PgBouncer connection pool has saturated above 85%. Incoming API queries from Next.js BFF middleware are queueing, causing p99 latencies to spike above 500ms, triggering timeout errors across frontend portals.

## Triage & Resolution Path

### Step 1: Isolate and Map Connection Source
Connect instantly to the production PostgreSQL cluster and query pg_stat_activity to find query allocations:
```sql
SELECT tenant_id, count(*), state
FROM pg_stat_activity
GROUP BY tenant_id, state
ORDER BY count(*) DESC;
```

### Step 2: Terminate Long-Running / Rogue Queries
If a rogue report query is hogging connection threads, terminate the PID immediately:
```sql
SELECT pg_cancel_backend(pid) 
FROM pg_stat_activity 
WHERE query_start < NOW() - INTERVAL '5 minutes' AND state = 'active';
```

### Step 3: Scale PgBouncer Pool Margins
If traffic volume is legitimate, scale PgBouncer container capacity limits up safely:
```bash
# Execute within active Kubernetes namespace
kubectl scale deployment/pgbouncer --replicas=5
```
