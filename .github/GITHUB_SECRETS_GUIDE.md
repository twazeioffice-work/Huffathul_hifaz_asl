# 🔐 GitHub Secrets Configuration Guide
**Suffat-ul Huffaz ERP & LMS DevSecOps Pipeline**

This guide outlines the precise steps and cryptographic parameters required to provision GitHub Repository Secrets for the active Zero-Trust CI/CD DevSecOps Automation Pipeline (`secops-pipeline.yml`).

By loading these secure keys, your automated runners will be able to perform live dependency audits, run the Hacker-Mode Penetration Simulator, and securely dispatch telemetry alerts to your Sentry and Slack hubs during build-time failures or security violations.

---

### 🛠️ Step-by-Step GitHub Provisioning
To load these variables into your GitHub Repository:

1. Navigate to your repository on GitHub.
2. Click on the **Settings** tab in the top navigation bar.
3. In the left-hand sidebar, expand **Secrets and variables** and select **Actions**.
4. Click the **New repository secret** button in the top-right corner.
5. Input the Name and Value exactly as specified below, then click **Add secret**.

---

### 🔑 Required Repository Secrets Directory

| Secret Name | Scope & Purpose | Recommended Format / Value |
| --- | --- | --- |
| **`SENTRY_DSN`** | Connects the CI/CD runner and application runtimes to your central Sentry Error Tracking Hub for real-time security alerts. | `https://[public_key]@[o_id].ingest.sentry.io/[p_id]` |
| **`SLACK_WEBHOOK_URL`** | The secure webhook integration URL pointing to your security operations (#secops-alerts) channel. | `https://hooks.slack.com/services/T000/B000/XXXXXX` |
| **`UPSTASH_REDIS_REST_URL`** | Serverless Redis connection endpoint utilized by the rate-limiter and lookup caches to log connection thresholds. | `https://[your-database-name].upstash.io` |
| **`UPSTASH_REDIS_REST_TOKEN`** | Cryptographic authorization token required to read/write state limits to your serverless database in real-time. | High-entropy alphanumeric token provided by Upstash Console |
| **`DATABASE_URL`** | The PostgreSQL 16 multi-tenant connection string used by the penetration suite to verify Row-Level Security (RLS) policies. | `postgresql://[user]:[password]@[host]:5432/[db]?sslmode=require` |
| **`META_APP_SECRET`** | The server-side secret key used to compute and verify inbound WhatsApp Webhook HMAC-SHA256 signatures. | 32-character hexadecimal string from your Meta App Dashboard |
| **`JWT_SECRET_KEY`** | A high-entropy cryptographic key utilized by your FastAPI backend to sign and authenticate administrative tokens. | Generate via: `openssl rand -hex 32` (Minimum 256-bit entropy) |

---

### 🔒 Security Best Practices for GitHub Secrets

**1. Enforce Environment-Specific Secrets**
Instead of using global repository secrets for both Staging and Production, utilize GitHub Environments to restrict access:
- Navigate to Settings > Environments and create Staging and Production environments.
- Configure environment secrets for each. This ensures your staging pipeline can never accidentally write to or modify your production PostgreSQL tables on GCP.

**2. Implement Automatic Rotation**
Configure a quarterly rotation schedule for your `JWT_SECRET_KEY` and `UPSTASH_REDIS_REST_TOKEN`. When rotating:
- Update the credentials in your Google Cloud Run / Railway environment variables first.
- Immediately update the matching GitHub repository secrets to prevent CI/CD runner execution blocks.

**3. Mask Logs**
Never print or echo these secrets in custom bash scripts or Github Actions run commands. GitHub automatically masks values matching repository secrets with `***`, but writing them directly to temporary local files during execution is strictly prohibited.

---

### 🚀 Verification Playbook
Once all secrets are loaded, verify your pipeline is fully operational:

1. Push a dummy commit or open a test Pull Request.
2. Navigate to the Actions tab of your repository.
3. Select the active DevSecOps Security Pipeline execution.
4. Verify that all 5 jobs (Bandit, Semgrep, Trivy SCA, Hacker-Mode Simulator, and Sentry Dispatch) execute successfully with green checks.
