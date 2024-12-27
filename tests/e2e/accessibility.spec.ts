import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility Tests', () => {
  test('homepage should be accessible', async ({ page }) => {
    await page.goto('/');
    
    // Run axe accessibility tests
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(results.violations).toEqual([]);
  });

  test('should handle keyboard navigation correctly', async ({ page }) => {
    await page.goto('/');

    // Test Tab navigation
    await page.keyboard.press('Tab');
    const firstFocus = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? {
        tagName: el.tagName,
        href: el.getAttribute('href'),
        text: el.textContent
      } : null;
    });

    expect(firstFocus?.tagName.toLowerCase()).toBe('a');

    // Test Skip Link
    const skipLink = await page.locator('a[href="#main-content"]');
    await skipLink.focus();
    await page.keyboard.press('Enter');
    
    const focused = await page.evaluate(() => 
      document.activeElement?.getAttribute('id')
    );
    expect(focused).toBe('main-content');
  });

  test('should have proper focus management in modals', async ({ page }) => {
    await page.goto('/');

    // Open modal
    await page.click('[aria-label="Open menu"]');

    // Focus should be trapped in modal
    const focusedElements = [];
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const focused = await page.evaluate(() => 
        document.activeElement?.getAttribute('data-testid')
      );
      focusedElements.push(focused);
    }

    // Verify focus is trapped
    expect(focusedElements.every(el => el?.startsWith('modal-'))).toBe(true);

    // Close modal
    await page.keyboard.press('Escape');
    
    // Focus should return to trigger
    const finalFocus = await page.evaluate(() => 
      document.activeElement?.getAttribute('aria-label')
    );
    expect(finalFocus).toBe('Open menu');
  });

  test('should have proper color contrast', async ({ page }) => {
    await page.goto('/');

    // Check specific elements for contrast
    const contrastViolations = await new AxeBuilder({ page })
      .withRules(['color-contrast'])
      .analyze();

    expect(contrastViolations.violations).toEqual([]);
  });

  test('should handle screen reader announcements', async ({ page }) => {
    await page.goto('/');

    // Test loading states
    await page.click('[data-testid="submit-button"]');
    
    const loadingMessage = await page.locator('[aria-live="polite"]');
    await expect(loadingMessage).toHaveText(/loading/i);

    // Test success messages
    const successMessage = await page.locator('[role="alert"]');
    await expect(successMessage).toBeVisible();
    await expect(successMessage).toHaveAttribute('aria-live', 'assertive');
  });

  test('should have proper form labeling', async ({ page }) => {
    await page.goto('/contact');

    // Check for proper label associations
    const formFields = await page.$$('input, textarea, select');
    for (const field of formFields) {
      const id = await field.getAttribute('id');
      const label = await page.$(`label[for="${id}"]`);
      expect(label).toBeTruthy();
    }

    // Check for proper aria-invalid states
    await page.click('button[type="submit"]');
    const invalidFields = await page.$$('[aria-invalid="true"]');
    expect(invalidFields.length).toBeGreaterThan(0);
  });

  test('should handle dynamic content updates', async ({ page }) => {
    await page.goto('/');

    // Test loading state announcements
    await page.click('[data-testid="load-more"]');
    
    const loadingRegion = await page.locator('[aria-live="polite"]');
    await expect(loadingRegion).toHaveText(/loading/i);

    // Test content update announcements
    await expect(loadingRegion).toHaveText(/new items loaded/i);
  });

  test('should support text resizing', async ({ page }) => {
    await page.goto('/');

    // Test text zoom
    await page.evaluate(() => {
      document.body.style.zoom = '200%';
    });

    // Check for layout issues
    const overlaps = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.height === 0 || rect.width === 0) return true;
      }
      return false;
    });

    expect(overlaps).toBe(false);
  });
});
