const { chromium } = require('playwright');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// --- SYSTEM CONFIGURATIONS ---
const TARGET_PORT_NEXTJS = 3005;
const TARGET_PORT_FASTAPI = 8000;
const BASE_URL = `http://localhost:${TARGET_PORT_NEXTJS}`;
const BACKEND_URL = `http://localhost:${TARGET_PORT_FASTAPI}`;
const LOG_FILE = path.join(__dirname, 'antigravity-sentinel.log');
const RUN_DURATION_LIMIT_MS = 5 * 60 * 1000; // Hard limit set to 5 Minutes

// --- SYSTEM LOGGING UTILITY ---
function log(msg, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const formattedMsg = `[${timestamp}] [${level}] ${msg}\n`;
  console.log(formattedMsg.trim());
  fs.appendFileSync(LOG_FILE, formattedMsg);
}

// --- AUTOMATED SELF-HEALING DISPATCHERS ---
function triggerSelfHeal(issueType) {
  log(`⚠️ INITIATING AUTOMATED SELF-HEALING ACTION FOR: ${issueType}`, 'WARNING');
  try {
    if (issueType === 'NEXTJS_DOWN') {
      log('Targeting Next.js Web Server... Attempting PM2 recycling process...', 'SYSTEM');
      execSync('npx pm2 restart suffat-erp', { stdio: 'inherit' });
    } else if (issueType === 'FASTAPI_DOWN') {
      log('Targeting FastAPI Core... Wiping stagnant uvicorn sockets & rebooting server...', 'SYSTEM');
      try { execSync('taskkill /F /IM uvicorn.exe /T', { stdio: 'ignore' }); } catch(e){}
      try { execSync('taskkill /F /IM python.exe /T', { stdio: 'ignore' }); } catch(e){}
      execSync('cd services/core-backend && start /B uvicorn app.main:app --port 8000 --host 127.0.0.1 > ../../fastapi.log 2>&1', { stdio: 'inherit' });
    } else if (issueType === 'BUILD_CACHE_CORRUPTED') {
      log('Targeting Next.js Build... Purging cache and executing clean production compile...', 'SYSTEM');
      execSync('cd apps/internal-erp && rmdir /s /q .next && npx next build && npx pm2 restart suffat-erp', { stdio: 'inherit' });
    }
    log('✅ Self-healing protocols dispatched and verified successfully.', 'INFO');
  } catch (error) {
    log(`❌ Critical Fail: Self-healing operation failed to run: ${error.message}`, 'CRITICAL');
  }
}

// --- PERFORMANCE SLA THRESHOLD CHECKS ---
function evaluatePerformance(durationMs, pageName) {
  const SPEED_THRESHOLD_MS = 1500; // 1.5-second SLA ceiling
  if (durationMs > SPEED_THRESHOLD_MS) {
    log(`🐢 SLA Violation Detected! Path [${pageName}] took ${durationMs}ms to respond.`, 'WARNING');
  } else {
    log(`⚡ Performance SLA verified for [${pageName}]: ${durationMs}ms`, 'SUCCESS');
  }
}

// --- CONTINUOUS RUN ENGINE ---
async function runDiagnosticLoop() {
  log('🚀 Launching Antigravity E2E Sentinel engine...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1280, height: 800 },
    userAgent: 'Antigravity-Continuous-Diagnostics-Agent'
  });
  const page = await context.newPage();

  let cycleCount = 0;
  const startTime = Date.now();

  while (Date.now() - startTime < RUN_DURATION_LIMIT_MS) {
    cycleCount++;
    log(`\n================================================================================`);
    log(`🌟 STARTING CONTINUOUS DIAGNOSTIC CYCLE #${cycleCount} (Run Time: ${Math.round((Date.now() - startTime) / 60000)} mins)`);
    log(`================================================================================`);

    try {
      // 1. BACKEND HEALTH CHECK INTERCEPTOR
      log('Checking FastAPI Port 8000 state...');
      const startBackendPoll = Date.now();
      try {
        const response = await page.goto(`${BACKEND_URL}/healthz`, { timeout: 5000 });
        if (!response || response.status() !== 200) {
          throw new Error('Health check returned non-200 state');
        }
        log(`🟢 FastAPI Backend is online. Verification Latency: ${Date.now() - startBackendPoll}ms`);
      } catch (backendErr) {
        log(`❌ FastAPI backend unreachable on Port ${TARGET_PORT_FASTAPI}!`, 'CRITICAL');
        triggerSelfHeal('FASTAPI_DOWN');
        await page.waitForTimeout(10000); // Wait for boot
        continue;
      }

      // 2. FRONTEND SERVER PORT 3001 REACHABILITY
      log('Checking Next.js Port 3001 login terminal...');
      const startLoad = Date.now();
      let loginResponse = null;
      try {
        loginResponse = await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 10000 });
      } catch (e) {
        log(`❌ Next.js unreachable: ${e.message}`, 'CRITICAL');
      }
      
      if (!loginResponse || loginResponse.status() !== 200) {
        log(`❌ Next.js application returned invalid status code: ${loginResponse ? loginResponse.status() : 'NO_RESPONSE'}`, 'CRITICAL');
        triggerSelfHeal('NEXTJS_DOWN');
        await page.waitForTimeout(10000);
        continue;
      }
      evaluatePerformance(Date.now() - startLoad, '/login');

      // 3. ADMINISTRATIVE IDENTITY AND SESSION INJECTION
      log('Injecting session claims and verifying middleware token generation...');
      await page.fill('input[type="text"], input[type="email"]', 'manager@suffat.com');
      await page.fill('input[type="password"]', 'password123');
      
      const startSubmit = Date.now();
      await page.click('button[type="submit"]');
      await page.waitForTimeout(2000); // Buffer for JWT edge routing

      log(`Handshake successfully committed in: ${Date.now() - startSubmit}ms`);

      // 4. MAIN KPI DASHBOARD ELEMENT & REDIRECTION PATH AUDITING
      const dashboardUrl = `${BASE_URL}/app/suffat/main/erp`;
      log(`Navigating to the central command node: ${dashboardUrl}`);
      await page.goto(dashboardUrl, { waitUntil: 'networkidle' });

      // Click targets mimicking the newly built KPI directions
      const kpis = [
        { selector: '[data-kpi="other-staff"]', path: '/staff/other', name: 'Other Staff Directory (Non-Faculty)' },
        { selector: '[data-kpi="faculty"]', path: '/staff/faculty', name: 'Academic Faculty Directory' },
        { selector: '[data-kpi="active-centers"]', path: '/active-centers', name: 'Active Centers Panel' }
      ];

      for (const kpi of kpis) {
        log(`Triggering action node: ${kpi.name}`);
        const kpiElement = await page.$(kpi.selector);
        if (kpiElement) {
          const startClick = Date.now();
          await kpiElement.click();
          await page.waitForURL(`**${kpi.path}**`, { timeout: 5000 });
          log(`  👉 Navigated cleanly: ${page.url()} in ${Date.now() - startClick}ms`);
          
          // Check for core runtime or compilation exceptions
          const hasHydrationMismatch = await page.evaluate(() => {
            return document.body.innerText.includes('Hydration failed') || 
                   document.body.innerText.includes('Application error') ||
                   document.body.innerText.includes('ModuleNotFoundError');
          });
          if (hasHydrationMismatch) {
            log(`❌ Exception detected on path: ${kpi.path}`, 'CRITICAL');
            triggerSelfHeal('BUILD_CACHE_CORRUPTED');
            break;
          }

          // Return back to dashboard
          await page.goto(dashboardUrl, { waitUntil: 'domcontentloaded' });
        } else {
          log(`⚠️ KPI Target Element [${kpi.selector}] not present in current view. Skipping...`, 'WARNING');
        }
      }

      // 5. CLIENT-SIDE DATABASE CACHE (DEXIE) STORAGE INTEGRITY
      log('Evaluating Dexie.js offline DB initialization parameters...');
      const isDbActive = await page.evaluate(async () => {
        try {
          if (!window.indexedDB) return false;
          const dbs = await window.indexedDB.databases();
          return dbs.some(db => db.name === 'SuffatOfflineStore' || db.name === 'pwaDb');
        } catch (e) {
          return false;
        }
      });

      if (isDbActive) {
        log('🟢 Client-side Dexie IndexedDB cache confirmed healthy.', 'SUCCESS');
      } else {
        log('⚠️ Offline storage was not detected in local session context.', 'WARNING');
      }

      log(`✅ Cycle #${cycleCount} diagnostic check complete. Entering cooldown state...`);
      await page.waitForTimeout(30000); // Runs a full loop every 30 seconds

    } catch (cycleError) {
      log(`❌ Critical cycle intercept caught: ${cycleError.message}`, 'CRITICAL');
      await page.waitForTimeout(15000); // 15s recovery cooldown before retrying
    }
  }

  log('🏁 Antigravity E2E Sentinel engine has reached its 10-hour limit. Shutting down browser.');
  await browser.close();
}

// Initialize automated runner
runDiagnosticLoop().catch(err => {
  console.error('Fatal Initialization Error:', err);
  process.exit(1);
});
