# SUFFAT-UL HUFFAZ DIGITAL ERP & LMS
## Enterprise-Grade Zero-Trust Security Compliance Checklist (47 High-Impact Controls)

This document is the master security compliance registry and implementation verification manual for the Suffat-ul Huffaz platform. Each control is strictly grounded in the platform's multi-tenant, cloud-native architecture, outlining specific threat vectors, explicit verification criteria, and production-ready implementation patterns.

---

### SECTION 1: IDENTITY, AUTHENTICATION, & AUTHORIZATION (5 Controls)

**1. Multi-Tenant Identity Isolation & Path Gating**
- **Target Domain:** Application Core / Dynamic Routing Middleware
- **Vulnerability Mitigated:** Cross-tenant data bleed, horizontal privilege escalation, and session spoofing.
- **Verification Checklist:**
  - [ ] Route-resolution middleware parses tenant context strictly from trusted domain mappings (e.g., `[tenant].suffat.in`) rather than client-controlled headers.
  - [ ] Row-Level Security (RLS) policies are active on all database tables, enforcing tenancy bounds: `(tenant_id = current_setting('app.current_tenant_id', true)::uuid)`.
  - [ ] Super-admin contexts bypass RLS only through secure database roles using parameterized connection pools.
- **Implementation Pattern:**
  ```sql
  ALTER TABLE student_ledgers ENABLE ROW LEVEL SECURITY;
  CREATE POLICY tenant_isolation_policy ON student_ledgers
  FOR ALL TO authenticated_role
  USING (tenant_id = current_setting('app.current_tenant_id', true)::uuid);
  ```

**2. Argon2id Password Cryptographic Hardening**
- **Target Domain:** FastAPI Identity Services / DB Layer
- **Vulnerability Mitigated:** Offline brute-force attacks, rainbow table pre-computation, and credential stuffing.
- **Verification Checklist:**
  - [ ] All raw password strings are salted and hashed using Argon2id with recommended parameters: Memory limit = 65536 KB, Time cost = 3 iterations, Parallelism = 4 threads.
  - [ ] Passwords have a mandatory minimum length of 12 characters, requiring uppercase, lowercase, numbers, and special characters.
  - [ ] The system enforces a maximum validation length limit of 72 characters to protect the backend hashing engines from resource exhaustion (DoS) attacks.

**3. Multi-Factor Authentication (MFA) Gating**
- **Target Domain:** Web Frontends / Secure API Gateways
- **Vulnerability Mitigated:** Account hijacking, compromised administrative sessions, and keylogger exploits.
- **Verification Checklist:**
  - [ ] Finance Administrators, Registrar Officers, and Super-Admins are strictly blocked from accessing dashboards without active TOTP MFA enrollment.
  - [ ] Verification endpoints validate MFA tokens server-side using secure, synchronized clocks with a strict 30-second drift window.
  - [ ] Backup recovery codes are securely generated using cryptographically strong random values, salted, and stored in hashed format.

**4. Hierarchical Role-Based Access Control (RBAC)**
- **Target Domain:** Nest.js Routing & FastAPI Route Policies
- **Vulnerability Mitigated:** Horizontal and vertical privilege escalation.
- **Verification Checklist:**
  - [ ] Users are mapped strictly to designated operational personas: `SUPER_ADMIN`, `CAMPUS_DIRECTOR`, `REGISTRAR`, `FINANCE_OFFICER`, `TEACHER`, `STUDENT`, `ALUMNI`.
  - [ ] Route-guards intercept incoming requests at the API Gateway level to assert that user scopes are aligned with requested routes.
  - [ ] The database enforces RBAC separation; the application connects to PostgreSQL using different roles depending on the runtime context.

**5. Decoupled Token Scope Constraints**
- **Target Domain:** OAuth2 / JWT Generation Endpoint
- **Vulnerability Mitigated:** Over-privileged session credentials and access token expansion leaks.
- **Verification Checklist:**
  - [ ] JWT token payloads contain explicit, granular scopes (e.g., `billing:write`, `academic:read`) rather than wide wildcard permissions.
  - [ ] Client applications request the absolute minimum required scopes for their active user journey.
  - [ ] Backend services enforce authorization audits per route, verifying both overall user role and the requested token scope before executing logic.

---

### SECTION 2: CRYPTOGRAPHIC DATA PROTECTION & ENCRYPTION (5 Controls)

**6. TLS 1.3 Transport Encryption Enforcement**
- **Target Domain:** GCP Load Balancers / Reverse Proxies
- **Vulnerability Mitigated:** Man-in-the-Middle (MitM) attacks, protocol downgrade attacks, and session sniffing.
- **Verification Checklist:**
  - [ ] All incoming web traffic is strictly routed through TLS 1.3, with TLS 1.2 set as the absolute minimum threshold.
  - [ ] HTTP Strict Transport Security (HSTS) headers are configured on all production domains with a minimum age of 1 year, including subdomains and preloading: `max-age=31536000; includeSubDomains; preload`.
  - [ ] Forward secrecy is strictly enforced across all active cryptographic cipher suites.

**7. AES-256-GCM Envelope Encryption at Rest**
- **Target Domain:** PostgreSQL Database / Storage Layer
- **Vulnerability Mitigated:** Cold-storage data theft, hard-disk leakage, and unauthorized database read access.
- **Verification Checklist:**
  - [ ] Personally Identifiable Information (PII) like national IDs, guardian phone numbers, and student health histories are encrypted inside database cells using AES-256-GCM.
  - [ ] Decryption operations take place in memory inside isolated API nodes; raw database administrators cannot read decrypted client records.
  - [ ] Cryptographic keys are rotated automatically every 90 days utilizing GCP KMS.

**8. SHA-256 Cryptographic Ledger Hash Anchoring**
- **Target Domain:** Financial Vault Ledger Tables
- **Vulnerability Mitigated:** Unauthorized internal database ledger manipulations and billing fraud.
- **Verification Checklist:**
  - [ ] Each transaction record inside the double-entry table generates a SHA-256 integrity block hash.
  - [ ] The block hash is calculated by binding the preceding transaction's hash, the current numeric balance values, the timestamp, and the tenant context.
  - [ ] Nightly automated cron jobs verify the entire chronological chain, alerting SREs immediately if any hash mismatch is detected.

**9. Ed25519 Administrative Non-Repudiation Seals**
- **Target Domain:** Ledger Adjustments / Master Approvals
- **Vulnerability Mitigated:** Repudiation of administrative financial changes and identity spoofing.
- **Verification Checklist:**
  - [ ] Manual ledgers, fee waivers, or asset write-offs must be signed using the administrator's local private Ed25519 key before backend submission.
  - [ ] The public key is permanently bound to the user profile; the backend verifies the signature before committing transactions.
  - [ ] Signed transaction payloads are stored in an append-only archive log, providing mathematical proof of authorship.

**10. Hardware-Backed Secret Vaulting (GCP KMS)**
- **Target Domain:** CI/CD & Production Runtime Infrastructure
- **Vulnerability Mitigated:** Hard-coded source repository secrets and unauthorized key access.
- **Verification Checklist:**
  - [ ] Production database credentials, JWT secrets, and payment API tokens are never written into `.env` files or repository code.
  - [ ] Secrets are fetched dynamically during container bootstrap utilizing GCP Secret Manager.
  - [ ] Secret access permissions are controlled strictly via Google Cloud IAM policies limited to the production container's service account.

---

### SECTION 3: SECURE SESSION HANDLING (5 Controls)

**11. HttpOnly, Secure, SameSite Cookie Enforcement**
- **Target Domain:** Browser Clients & Authentication Routing
- **Vulnerability Mitigated:** Cross-Site Scripting (XSS) token theft and Cross-Site Request Forgery (CSRF) exploits.
- **Verification Checklist:**
  - [ ] Authentication tokens are written strictly inside cookies compiled with the `HttpOnly` flag to prevent JavaScript read access.
  - [ ] Cookies carry the `Secure` attribute, ensuring transport occurs strictly over active HTTPS links.
  - [ ] The SameSite attribute is set to `Strict` (or `Lax` where cross-origin navigation is required), preventing automatic credential inclusion in third-party contexts.

**12. Sliding Session Windows & Expiry Management**
- **Target Domain:** JWT Authorization Engine
- **Vulnerability Mitigated:** Stale session reuse and long-running token theft vulnerabilities.
- **Verification Checklist:**
  - [ ] Access tokens maintain a strict, short lifespan of exactly 15 minutes.
  - [ ] Refresh tokens are securely bound inside HttpOnly cookies, having an expiration limit of 7 days, and are automatically rotated on use.
  - [ ] If a refresh token is reused, the backend instantly revokes the entire token family, logging a potential compromise alert.

**13. Upstash Redis Active Session Blacklisting**
- **Target Domain:** Next.js Edge Middleware Router
- **Vulnerability Mitigated:** Delayed token revocation and session hijack replay attacks.
- **Verification Checklist:**
  - [ ] When a user triggers a logout, their token's unique ID (`jti`) is immediately logged to an in-memory Upstash Redis blacklist.
  - [ ] The sliding-window rate limiter and session verifier check this list on every incoming request at the edge.
  - [ ] Blocked tokens are rejected with an immediate HTTP 401 response, completely bypassing database queries to shield the SQL pool.

**14. Automated Browser State Sanitization**
- **Target Domain:** React Client / Mobile Storage
- **Vulnerability Mitigated:** Shared workstation data leakage and physical cache harvesting.
- **Verification Checklist:**
  - [ ] Executing a logout triggers a cascade function that purges client-side IndexedDB databases (e.g., WatermelonDB sync states).
  - [ ] LocalStorage and SessionStorage fields containing student names, grades, or administrative details are completely wiped.
  - [ ] The application forces a hard redirect to the login screen, clearing active memory heaps.

**15. IP-Fingerprint Session Correlation**
- **Target Domain:** Application Core Gateway Middleware
- **Vulnerability Mitigated:** Session hijacking across separate networks.
- **Verification Checklist:**
  - [ ] The user's initial session registers their base IP range and Browser User-Agent.
  - [ ] If a request arrives with a valid session cookie but the client IP range or User-Agent changes abruptly, the middleware blocks the transaction.
  - [ ] The system forces immediate re-authentication, revoking the active session token and logging a Sentry alert.

---

### SECTION 4: ROBUST ERROR BOUNDARIES & TELEMETRY (5 Controls)

**16. Comprehensive React Application Error Boundaries**
- **Target Domain:** Frontend React Codebase
- **Vulnerability Mitigated:** UI crashes, blank screens, and accidental console stack trace exposure.
- **Verification Checklist:**
  - [ ] The React DOM is wrapped in hierarchical Error Boundary components to capture runtime rendering exceptions.
  - [ ] Crashed widgets fail gracefully, rendering a clean, stylized fallback message while keeping the rest of the application fully functional.
  - [ ] Production builds explicitly strip developer source maps, preventing exposure of raw codebase layouts.

**17. Local PII Redaction on Exception Log Sinks**
- **Target Domain:** Sentry SDK Setup / Log Handlers
- **Vulnerability Mitigated:** Compliance violations and inadvertent PII/Token exposure in logging servers.
- **Verification Checklist:**
  - [ ] Sentry SDK initializers implement custom `before_send` hooks to parse and redact sensitive information locally.
  - [ ] Fields matching pattern matches for passwords, authentication headers, credit cards, and national identifiers are replaced with `[REDACTED]`.
  - [ ] Server log writers (Pino/Winston) pass inputs through a sanitization filter before disk-write.

**18. Dynamic Context Telemetry Enrichment**
- **Target Domain:** Telemetry Engine / Error Hub
- **Vulnerability Mitigated:** Delayed SRE triage times and lack of operational incident context.
- **Verification Checklist:**
  - [ ] Operational failures are enriched with active tenant tags, transaction types, and anonymized user roles.
  - [ ] Context payloads preserve user anonymity; they include system IDs rather than direct student names or phone numbers.
  - [ ] Network performance indicators, CPU health, and link states are automatically attached to exceptions to expedite troubleshooting.

**19. Client-Side Network Flakiness Resiliency**
- **Target Domain:** Client API Fetch Layer / Offline Manager
- **Vulnerability Mitigated:** Data-loss during transient network drops and system stalling.
- **Verification Checklist:**
  - [ ] API clients execute requests utilizing an exponential retry back-off pattern with random jitter to prevent "thundering herd" gateway failures.
  - [ ] Failed sync mutations are wait-listed inside a client-side transaction queue, letting users work seamlessly while offline.
  - [ ] High latency or packet drop conditions prompt a visual indicator to prepare users for potential offline-first storage states.

**20. Atomic Crash-to-Safe-State Rollbacks**
- **Target Domain:** Client State Managers / Local Databases
- **Vulnerability Mitigated:** Half-written local states and corrupted synchronization databases.
- **Verification Checklist:**
  - [ ] Local state writes to IndexedDB use transactional blocks; failures rollback the state to the last verified checkpoint.
  - [ ] If a synchronization sequence fails midway, the client resets its sync pointer, ensuring subsequent runs re-transmit missing chunks.
  - [ ] High-priority financial transactions are committed locally only after receiving a direct receipt confirmation hash from the cloud database.

---

### SECTION 5: SERVERLESS RATE LIMITING & TRAFFIC THROTTLING (5 Controls)

**21. Sliding-Window Rate Throttling**
- **Target Domain:** Next.js Edge Middleware / Upstash Redis
- **Vulnerability Mitigated:** Bruteforce login attempts, registration spam, and denial-of-service (DoS) endpoint exhaustion.
- **Verification Checklist:**
  - [ ] Authentication gateways enforce a strict sliding-window rate limit (e.g., maximum 5 login requests per minute per IP address).
  - [ ] Limit tracking is handled at the network edge utilizing Upstash serverless connections.
  - [ ] Requests exceeding thresholds are blocked at the edge with HTTP 429 Too Many Requests, saving backend compute resources.

**22. Tenant Resource Allocation Quotas**
- **Target Domain:** GCP API Gateway / Application Middleware
- **Vulnerability Mitigated:** Resource hogging, and single-tenant loops crashing multi-tenant infrastructure.
- **Verification Checklist:**
  - [ ] Tenants are restricted to defined API request budgets.
  - [ ] Background batch sync jobs are assigned lower priority queues, preventing them from exhausting bandwidth needed for live admissions or exams.
  - [ ] Extreme spikes from a single tenant automatically route their requests to isolated cold-standby serverless instances, insulating other institutions.

**23. Cryptographic Webhook Authentication**
- **Target Domain:** FastAPI Webhook Receiver Routes
- **Vulnerability Mitigated:** Webhook spoofing, unauthorized student data updates, and forged transaction notifications.
- **Verification Checklist:**
  - [ ] Incoming payloads from external systems (such as Meta Cloud WhatsApp Webhooks) require signature verification using SHA-256 HMAC.
  - [ ] The signature is calculated using the raw request body and the secure salt key stored in GCP Secret Manager.
  - [ ] Replay attacks are mitigated by validating the payload's timestamp header against a strict 5-minute drift allowance.

**24. Automatic Edge Load-Shedding Gates**
- **Target Domain:** GCP Cloud Run Orchestration / Ingress
- **Vulnerability Mitigated:** Cascading infrastructure failures during traffic spikes.
- **Verification Checklist:**
  - [ ] GCP Ingress rules analyze server CPU and connection queues.
  - [ ] When backend CPU usage exceeds 90%, load-shedding is triggered, returning HTTP 503 Service Unavailable to low-priority queries.
  - [ ] Core transactional paths (e.g., payment submissions, attendance markers) are prioritized, remaining active while analytics routes are temporarily throttled.

**25. Malicious Request Pattern Blocking**
- **Target Domain:** Edge Firewall / Cloudflare WAF
- **Vulnerability Mitigated:** SQL Injection, Cross-Site Scripting (XSS), and zero-day framework exploits.
- **Verification Checklist:**
  - [ ] Edge firewalls inspect incoming URI paths, query parameters, and POST payloads.
  - [ ] Requests containing common SQL keywords (`UNION`, `SELECT`, `OR 1=1`) or script tags (`<script>`) are automatically blocked before hitting application nodes.
  - [ ] Non-standard HTTP headers or mismatched payloads are rejected at the edge.

---

### SECTION 6: INPUT VALIDATION & CODE SECURITY (5 Controls)

**26. Runtime Input Schema Validation**
- **Target Domain:** FastAPI Backend / Nest.js Modules
- **Vulnerability Mitigated:** Buffer overflows, invalid data types, and malicious JSON payload injections.
- **Verification Checklist:**
  - [ ] All inbound API payloads are parsed and validated utilizing strict serialization models (Zod for frontend, Pydantic for backend).
  - [ ] Input values have strict boundary controls (e.g., phone numbers must match exact regex limits, ages must be realistic).
  - [ ] Payloads containing undeclared fields are automatically rejected, preventing parameters from slipping into databases.

**27. ORM Parameterization Enforcement**
- **Target Domain:** Database Query Layer / Repository Files
- **Vulnerability Mitigated:** SQL Injection (SQLi).
- **Verification Checklist:**
  - [ ] Direct string formatting, variable interpolation, or concatenation are strictly banned in SQL queries.
  - [ ] All database interactions use SQLAlchemy, Prisma, or parameterized SQL blocks.
  - [ ] Static analysis checks (e.g., Bandit, Semgrep) are run inside CI/CD pipelines to flag any raw SQL string building.

**28. Cross-Site Scripting (XSS) Prevention**
- **Target Domain:** Web Client / Template Renderers
- **Vulnerability Mitigated:** Stored and reflected XSS attacks.
- **Verification Checklist:**
  - [ ] Next.js React renders escape variables automatically, neutralizing script tags embedded in input text.
  - [ ] Rich-text editors (e.g., used by teachers for assignment descriptions) sanitize inputs server-side to remove unsafe HTML tags.
  - [ ] Content Security Policy (CSP) headers block the execution of inline scripts and unauthorized external code.

**29. Content-Type and Body Size Constraints**
- **Target Domain:** API Gateway / Nginx Ingress
- **Vulnerability Mitigated:** Large-payload DoS attacks and content bypass exploits.
- **Verification Checklist:**
  - [ ] API gateways check that incoming request bodies match their declared `Content-Type` header (e.g., `application/json`).
  - [ ] The maximum payload size for standard JSON routes is capped at exactly 10MB.
  - [ ] Requests exceeding this size limit are rejected immediately with HTTP 413 Payload Too Large.

**30. Secure File Upload Sandboxing**
- **Target Domain:** Media Upload Handlers
- **Vulnerability Mitigated:** Remote Code Execution (RCE) via malicious files.
- **Verification Checklist:**
  - [ ] Uploads for student/facility verification are limited to specific extensions (`.jpg`, `.jpeg`, `.png`, `.pdf`).
  - [ ] Magic-byte checks are run on files to verify their true content, preventing users from bypassing controls by renaming extension labels.
  - [ ] Uploaded files are renamed using cryptographically secure UUIDs and saved in isolated, non-executable GCP Storage buckets.

---

### SECTION 7: AUDIT LOGGING & SIEM (5 Controls)

**31. Immutable Audit Ledger Trails**
- **Target Domain:** PostgreSQL Audit Engine
- **Vulnerability Mitigated:** Unauthorized internal database ledger manipulations and billing fraud.
- **Verification Checklist:**
  - [ ] Core financial updates trigger database-level inserts into an isolated audit table.
  - [ ] Database triggers prevent updating or deleting rows in this table, making it strictly append-only.
  - [ ] Audit logs contain the transaction balance change, authorizer ID, IP address, and preceding block hash.

**32. Comprehensive Administrative Tracking**
- **Target Domain:** Admin Routing Controllers
- **Vulnerability Mitigated:** Lack of administrative visibility and privilege misuse.
- **Verification Checklist:**
  - [ ] Any administrative action (updating grades, altering student records, granting user roles) is recorded.
  - [ ] Logs note the administrator's account ID, action type, before-and-after states, and authorization token ID.
  - [ ] Storing passwords, credit card numbers, or sensitive PII in audit log descriptions is strictly prohibited.

**33. Chronological Log Chain Integrity**
- **Target Domain:** Database Table Triggers
- **Vulnerability Mitigated:** Log insertion tampering and log gap deletion.
- **Verification Checklist:**
  - [ ] Audit table rows include an auto-incrementing big-integer primary key managed by the database.
  - [ ] Database triggers require new log entries to contain the hash of the preceding entry, establishing a chronological validation chain.
  - [ ] Cryptographic validation scripts run daily to audit sequence numbers, flagging any deleted rows or alterations.

**34. GCP Cloud Logging Sinks**
- **Target Domain:** GCP Operations Suite
- **Vulnerability Mitigated:** Disk-fill log exhaustion and server crash data loss.
- **Verification Checklist:**
  - [ ] Core server output streams (`stdout` and `stderr`) are forwarded to GCP Cloud Logging.
  - [ ] Log retention periods are configured for a minimum of 1 year for compliance audits.
  - [ ] Sinks are isolated in secure storage buckets, locked down with IAM rules to prevent access by standard developers.

**35. SIEM Real-Time Breach Alerting**
- **Target Domain:** Logging Middleware / Sentry Alerting
- **Vulnerability Mitigated:** Delayed breach identification and delayed security response.
- **Verification Checklist:**
  - [ ] Critical security alerts (e.g., SQL injection flags, RLS failures, JWT replay attempts) trigger high-severity exceptions.
  - [ ] Sentry webhooks route these alerts to Slack channels and PagerDuty schedules for 24/7 coverage.
  - [ ] Multiple identical security exceptions from an IP address trigger automated IP block rules at the gateway level.

---

### SECTION 8: DISASTER RECOVERY & BACKUPS (4 Controls)

**36. Continuous Point-In-Time Recovery (PITR)**
- **Target Domain:** Google Cloud SQL / Database Engine
- **Vulnerability Mitigated:** Database corruption, catastrophic server failure, and ransomware attacks.
- **Verification Checklist:**
  - [ ] Write-Ahead Logs (WAL) are archived continuously to isolated, geo-replicated storage buckets.
  - [ ] Backups are configured with a retention window of 30 days, enabling recovery to any exact second within that timeframe.
  - [ ] Daily base backups run during low-traffic windows to maintain performance benchmarks.

**37. Immutable WORM Storage Archival**
- **Target Domain:** Google Cloud Storage Buckets
- **Vulnerability Mitigated:** Backups being deleted by attackers during server compromises.
- **Verification Checklist:**
  - [ ] Database backup buckets use Object Retention Policies configured for Write-Once-Read-Many (WORM) behavior.
  - [ ] Once written, backup files cannot be deleted, overwritten, or modified by any user or administrator during the retention window.
  - [ ] Buckets are isolated in a separate, dedicated GCP billing sub-account with separate authentication keys.

**38. Automated Backup Decryption & Verification Tests**
- **Target Domain:** SRE Automation / Orchestration
- **Vulnerability Mitigated:** Hidden backup corruption or failed encryption key recovery issues.
- **Verification Checklist:**
  - [ ] Daily automated workflows retrieve random historical backups and restore them to an isolated testing container.
  - [ ] The restoration runner executes basic verification queries (checking table integrity and row counts).
  - [ ] If a restoration fails or data mismatch is detected, high-priority notifications are dispatched to SRE alerts immediately.

**39. Multi-Tenant Surgical Restoration Engines**
- **Target Domain:** SRE Disaster Recovery Scripts
- **Vulnerability Mitigated:** Complete database downtime during single-tenant recovery operations.
- **Verification Checklist:**
  - [ ] Recovery scripts are prepared to extract and restore a single tenant's data fields without modifying other active tenants.
  - [ ] The extraction program pulls target tenant data from WAL backups using isolated UUID keys.
  - [ ] The restore pipeline deletes corrupted rows for that specific tenant and inserts verified database state rows inside atomic, isolated transactions.

---

### SECTION 9: REAL-TIME INFRASTRUCTURE MONITORING (4 Controls)

**40. Synthetic Heartbeat Monitoring**
- **Target Domain:** Monitoring Infrastructure / GCP uptime
- **Vulnerability Mitigated:** Silent micro-service crashes and undetected user service drops.
- **Verification Checklist:**
  - [ ] Automated external crawlers ping critical endpoints (Login, LMS Sync API, Payment Webhook) every 60 seconds.
  - [ ] Pings verify both response times (alerting if > 2.0s) and return payloads (requiring HTTP 200).
  - [ ] Heartbeat metrics are compiled to show real-time SLA averages on internal administration dashboards.

**41. Database Connection Pool Metrics**
- **Target Domain:** Cloud SQL / Application Clusters
- **Vulnerability Mitigated:** Database connection exhaustion and database thread stalling.
- **Verification Checklist:**
  - [ ] Prometheus agents track active database connections, waiting queues, and pool saturation metrics.
  - [ ] Alerts trigger if connection pool usage remains above 80% for more than 5 minutes.
  - [ ] Connection timeout limits are capped at 15 seconds, preventing deadlocked transactions from stalling backend compute threads.

**42. Container Resource Autoscaling Alerts**
- **Target Domain:** GCP Cloud Run / Railway Orchestrator
- **Vulnerability Mitigated:** Traffic spikes crashing servers and CPU exhaustion.
- **Verification Checklist:**
  - [ ] Production containers scale dynamically based on active CPU usage (autoscaling threshold set to 75% CPU load).
  - [ ] The system restricts maximum container instances to control billing budgets during DDoS spikes.
  - [ ] Real-time alerts warn operations teams if instances scale beyond 85% of allowed thresholds.

**43. Edge Caching & Resolution Latency Tracking**
- **Target Domain:** Upstash / CDN Logs
- **Vulnerability Mitigated:** Slow regional connections and edge cache performance drops.
- **Verification Checklist:**
  - [ ] Telemetry tracks edge resolution times for routing lookup processes.
  - [ ] Monitoring tools log cache hit/miss rates for dynamic host routing checks.
  - [ ] Alarms notify engineers if regional request latencies from core school locations exceed 150ms.

---

### SECTION 10: DEPENDENCY SCANNING & SUPPLY-CHAIN (4 Controls)

**44. Pinned Package Signatures and Hash Auditing**
- **Target Domain:** Application Packages / CI/CD
- **Vulnerability Mitigated:** Dependency injection attacks and malicious package substitution exploits.
- **Verification Checklist:**
  - [ ] Production dependencies in Python and Node.js are pinned to exact versions with SHA-256 integrity hashes.
  - [ ] Floating ranges (`^`, `~`, or `*`) are disallowed inside configuration package files.
  - [ ] Custom lock files (`pnpm-lock.yaml`, `requirements.txt`) are checked into the central code repository to standardize dev builds.

**45. Static Application Security Testing (SAST) Gates**
- **Target Domain:** GitHub Actions CI/CD Pipeline
- **Vulnerability Mitigated:** Dangerous programming patterns and insecure library imports slipping into code branches.
- **Verification Checklist:**
  - [ ] Automated Bandit and Semgrep scans run on every pull request submitted to main branches.
  - [ ] Scans analyze code for raw SQL formatting, hard-coded secrets, and unsafe execution parameters.
  - [ ] Code integration merges are blocked if scans identify high-severity flags.

**46. Hardened Distroless Sandbox Containers**
- **Target Domain:** Container Dockerfile / Ingress
- **Vulnerability Mitigated:** OS exploitation, shell injection, and post-compromise container escalation.
- **Verification Checklist:**
  - [ ] Production containers use multi-stage builds compiled into hardened distroless base images (e.g., `gcr.io/distroless/static-debian12`).
  - [ ] OS utilities (including package managers and shell environments like bash/sh) are stripped from production builds.
  - [ ] Containers run under dedicated non-root accounts, restricting file modification permissions.

**47. Automated Image Vulnerability (CVE) Scanning**
- **Target Domain:** CI/CD Build Runners
- **Vulnerability Mitigated:** Zero-day container vulnerabilities and out-of-date system dependencies.
- **Verification Checklist:**
  - [ ] Build runners execute Trivy security scans over compiled container images before registry upload.
  - [ ] If images contain any high or critical CVE vulnerabilities, the build is blocked.
  - [ ] Container bases undergo weekly automated scans to flag newly discovered exploits, logging updates to operations teams.
