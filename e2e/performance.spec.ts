import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    // Enable performance metrics
    const client = await page.context().newCDPSession(page);
    await client.send('Performance.enable');

    await page.goto('/');

    // Measure LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            resolve(entries[entries.length - 1].startTime);
          }
        }).observe({ entryTypes: ['largest-contentful-paint'] });
      });
    });

    // Measure FID (First Input Delay)
    const fid = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          if (entries.length > 0) {
            resolve(entries[0].duration);
          }
        }).observe({ entryTypes: ['first-input'] });
      });
    });

    // Measure CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          resolve(clsValue);
        }).observe({ entryTypes: ['layout-shift'] });
      });
    });

    // Assert performance metrics meet thresholds
    expect(lcp).toBeLessThan(2500); // LCP should be < 2.5s
    expect(fid).toBeLessThan(100);  // FID should be < 100ms
    expect(cls).toBeLessThan(0.1);  // CLS should be < 0.1

    // Check Time to First Byte (TTFB)
    const timing = JSON.parse(
      await page.evaluate(() => JSON.stringify(performance.timing))
    );
    const ttfb = timing.responseStart - timing.navigationStart;
    expect(ttfb).toBeLessThan(600); // TTFB should be < 600ms
  });

  test('should optimize images correctly', async ({ page }) => {
    await page.goto('/');

    // Check all images have correct attributes
    const images = await page.locator('img').all();
    for (const image of images) {
      // Check for lazy loading
      const loading = await image.getAttribute('loading');
      expect(loading).toBe('lazy');

      // Check for correct alt text
      const alt = await image.getAttribute('alt');
      expect(alt).toBeTruthy();

      // Check image dimensions are specified
      const width = await image.getAttribute('width');
      const height = await image.getAttribute('height');
      expect(width).toBeTruthy();
      expect(height).toBeTruthy();
    }
  });

  test('should load critical resources efficiently', async ({ page }) => {
    const client = await page.context().newCDPSession(page);
    await client.send('Network.enable');

    // Track resource loading
    const resources = new Map();
    client.on('Network.responseReceived', event => {
      resources.set(event.requestId, event);
    });

    await page.goto('/');

    // Check resource prioritization
    const criticalResources = Array.from(resources.values())
      .filter(r => r.type === 'Script' || r.type === 'Stylesheet')
      .map(r => ({
        url: r.response.url,
        priority: r.response.priority
      }));

    // Critical resources should have high priority
    const mainJsResource = criticalResources.find(r => r.url.includes('main'));
    expect(mainJsResource?.priority).toBe('High');
  });
})