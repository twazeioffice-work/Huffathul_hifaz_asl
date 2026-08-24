import { test, expect } from '@playwright/test';

const USERS = [
  { role: 'Super Admin', email: 'admin@suffat.org', pass: 'password123' },
  { role: 'Center Admin', email: 'admin_aa59cbc5f3@suffat.com', pass: 'password123' },
  { role: 'Nazim', email: 'manager@suffat.com', pass: 'password123' },
  { role: 'Ustad', email: 'usthad_51c88a81db@suffat.com', pass: 'password123' }
];

test.describe('Mandatory Comprehensive UI Click Crawler', () => {
  for (const user of USERS) {
    test(`Should successfully crawl and render all links for ${user.role}`, async ({ page }) => {
      // 1. Navigate to login
      await page.goto('/login');
      
      // 2. Perform authentication
      await page.fill('input[type="email"], input[type="text"]', user.email);
      await page.fill('input[type="password"]', user.pass);
      await page.click('button[type="submit"]');
      
      // 3. Wait for redirect to dashboard
      await page.waitForURL('**/app/**', { timeout: 10000 });
      
      // 4. Extract all internal dashboard links
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map(a => a.href)
          .filter(href => href.startsWith(window.location.origin) && !href.includes('logout'));
      });
      
      const uniqueLinks = [...new Set(hrefs)];
      expect(uniqueLinks.length).toBeGreaterThan(0);
      
      // 5. Hard click test each link to ensure it renders a 200 OK without Next.js errors
      for (const link of uniqueLinks) {
        const response = await page.goto(link, { waitUntil: 'domcontentloaded' });
        expect(response?.status()).toBeLessThan(400); // Assert no 404/500
        
        // Assert no hydration or application errors on the page
        const errorText = await page.evaluate(() => document.body.innerText);
        expect(errorText).not.toContain('Application error');
        expect(errorText).not.toContain('Hydration failed');
      }
    });
  }
});
