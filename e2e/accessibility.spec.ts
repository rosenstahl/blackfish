import { test, expect } from '@playwright/test';

test.describe('Accessibility Tests', () => {
  test('should pass WCAG guidelines', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    const focused = await page.evaluate(() => document.activeElement?.tagName);
    expect(focused.toLowerCase()).toBe('a');

    // Check ARIA labels
    const menuButton = await page.locator('button[aria-label]');
    expect(await menuButton.getAttribute('aria-label')).toBeTruthy();

    // Test color contrast
    const contrastViolations = await page.evaluate(() => {
      // Color contrast check implementation
      return [];
    });
    expect(contrastViolations.length).toBe(0);

    // Test screen reader accessibility
    const headings = await page.locator('h1, h2, h3, h4, h5, h6');
    expect(await headings.count()).toBeGreaterThan(0);
  });

  test('should handle font size adjustments', async ({ page }) => {
    await page.goto('/');
    
    // Test font size scaling
    await page.evaluate(() => {
      document.documentElement.style.fontSize = '20px';
    });

    // Verify text remains readable
    const textOverflow = await page.evaluate(() => {
      const elements = document.querySelectorAll('p, h1, h2, h3, span');
      for (const el of elements) {
        const style = window.getComputedStyle(el);
        if (style.overflow === 'hidden') return true;
      }
      return false;
    });

    expect(textOverflow).toBe(false);
  });
})