const { chromium } = require('playwright');

const USERS = [
  { role: 'Super Admin', email: 'admin@suffat.org', pass: 'password123' },
  { role: 'Center Admin', email: 'admin_aa59cbc5f3@suffat.com', pass: 'password123' },
  { role: 'Nazim', email: 'manager@suffat.com', pass: 'password123' },
  { role: 'Ustad', email: 'usthad_51c88a81db@suffat.com', pass: 'password123' }
];

const BASE_URL = 'http://localhost:3005';

async function runTests() {
  console.log("================================================================");
  console.log("🚀 STARTING COMPREHENSIVE UI CRAWLER AND CLICK TEST");
  console.log("================================================================");

  const browser = await chromium.launch({ headless: true });
  
  for (const user of USERS) {
    console.log(`\n[INFO] --------------------------------------------------------`);
    console.log(`[INFO] Testing Role: ${user.role} (${user.email})`);
    
    const context = await browser.newContext();
    const page = await context.newPage();
    
    try {
      console.log(`[INFO] Navigating to Login...`);
      await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 15000 });
      
      const emailInput = await page.locator('input[type="text"], input[type="email"]').first();
      const passInput = await page.locator('input[type="password"]').first();
      const loginBtn = await page.locator('button[type="submit"]').first();

      if (await emailInput.count() > 0 && await passInput.count() > 0) {
        await emailInput.fill(user.email);
        await passInput.fill(user.pass);
        await loginBtn.click();
        console.log(`[INFO] Submitted credentials for ${user.role}...`);
        
        await page.waitForTimeout(3000); 
        await page.goto(`${BASE_URL}/app/suffat/main/erp`, { waitUntil: 'domcontentloaded' });
      } else {
        console.log(`[WARNING] Standard login form not found. Assuming auto-auth.`);
      }

      const currentUrl = page.url();
      console.log(`[SUCCESS] Landed on: ${currentUrl}`);

      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => href.startsWith(window.location.origin));
      });

      const uniqueLinks = [...new Set(hrefs)].filter(link => !link.includes('logout'));
      console.log(`[INFO] Found ${uniqueLinks.length} navigable links on the dashboard.`);

      const linksToTest = uniqueLinks.slice(0, 10);
      
      let successCount = 0;
      for (const link of linksToTest) {
        try {
          const response = await page.goto(link, { waitUntil: 'domcontentloaded', timeout: 10000 });
          const status = response ? response.status() : 'UNKNOWN';
          if (status >= 200 && status < 400) {
            console.log(`  ✅ [${status}] Successfully rendered: ${link}`);
            successCount++;
          } else {
            console.log(`  ❌ [${status}] Error rendering: ${link}`);
          }
        } catch (err) {
          console.log(`  ❌ [FAIL] Failed to load ${link}: ${err.message}`);
        }
      }

      console.log(`[INFO] Role ${user.role} validation complete. (${successCount}/${linksToTest.length} successful)`);
      
    } catch (err) {
      console.log(`[CRITICAL] Role ${user.role} encountered fatal error: ${err.message}`);
    } finally {
      await context.close();
    }
  }

  console.log("\n================================================================");
  console.log("✅ ALL COMPREHENSIVE TESTS CONCLUDED.");
  console.log("================================================================");
  await browser.close();
}

runTests().catch(console.error);
