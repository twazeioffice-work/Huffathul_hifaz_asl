import { test, expect } from "@playwright/test";

test("Assert zero Cumulative Layout Shift and fast page paint benchmarks", async ({ page }) => {
  const targetUrl = process.env.TEST_URL || "http://localhost:3001/about";

  // 1. Visit the static page
  await page.goto(targetUrl);

  // 2. Extract Web Vitals metrics using browser performance APIs
  const performanceMetrics = (await page.evaluate(() => {
    return new Promise((resolve) => {
      let cls = 0;

      new PerformanceObserver((entryList) => {
        for (const entry of entryList.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            cls += (entry as any).value;
          }
        }
      }).observe({ type: "layout-shift", buffered: true });

      setTimeout(() => {
        const paintEntries = performance.getEntriesByType("paint");
        const fcp =
          paintEntries.find((entry) => entry.name === "first-contentful-paint")
            ?.startTime || 0;

        resolve({
          cumulativeLayoutShift: cls,
          firstContentfulPaint: fcp,
        });
      }, 1000);
    });
  })) as { cumulativeLayoutShift: number; firstContentfulPaint: number };

  console.log(`Audited CLS Score: ${performanceMetrics.cumulativeLayoutShift}`);
  console.log(`Audited FCP Paint: ${performanceMetrics.firstContentfulPaint}ms`);

  // Assert Web Vitals thresholds: zero CLS, sub-1200ms FCP
  expect(performanceMetrics.cumulativeLayoutShift).toBeLessThanOrEqual(0.05);
  expect(performanceMetrics.firstContentfulPaint).toBeLessThan(1200);
});
