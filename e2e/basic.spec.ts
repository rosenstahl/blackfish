import { test, expect, type Page } from '@playwright/test';

test.describe('BLACKFISH Website E2E Tests', () => {
  let page: Page;

  test.beforeEach(async ({ page: p }) => {
    page = p;
    await page.goto('/');
  });

  test.describe('Navigation & Layout', () => {
    test('should have correct meta tags', async () => {
      const title = await page.title();
      expect(title).toContain('BLACKFISH.DIGITAL');
      
      const description = await page.getAttribute('meta[name="description"]', 'content');
      expect(description).toBeTruthy();
    });

    test('should have working navigation links', async () => {
      const navLinks = await page.getByRole('link').filter({ hasText: /Leistungen|Referenzen|Pakete|Kontakt/ }).all();
      expect(navLinks.length).toBeGreaterThan(0);

      for (const link of navLinks) {
        await expect(link).toBeVisible();
        await expect(link).toBeEnabled();
      }
    });

    test('should be responsive', async () => {
      const viewports = [
        { width: 375, height: 667 },  // Mobile
        { width: 768, height: 1024 }, // Tablet
        { width: 1280, height: 800 }, // Desktop
      ];

      for (const viewport of viewports) {
        await page.setViewportSize(viewport);
        await expect(page.locator('nav')).toBeVisible();
        await expect(page.locator('footer')).toBeVisible();
      }
    });
  });

  test.describe('Hero Section', () => {
    test('should display hero content correctly', async () => {
      await expect(page.getByRole('heading', { level: 1 })).toContainText('Digitale Lösungen');
      await expect(page.locator('#hero')).toBeVisible();
      
      // CTA Buttons
      const ctaButtons = await page.getByRole('button').filter({ hasText: /Pakete|Beratung/ }).all();
      expect(ctaButtons.length).toBe(2);

      for (const button of ctaButtons) {
        await expect(button).toBeVisible();
        await expect(button).toBeEnabled();
      }
    });
  });

  test.describe('Services Section', () => {
    test('should display all service cards', async () => {
      await page.click('text=Leistungen');
      const serviceSection = page.locator('#services');
      await expect(serviceSection).toBeVisible();

      const serviceCards = await serviceSection.locator('.service-card').all();
      expect(serviceCards.length).toBeGreaterThan(0);

      for (const card of serviceCards) {
        await expect(card).toBeVisible();
        await expect(card.locator('h3')).toBeVisible();
        await expect(card.locator('p')).toBeVisible();
      }
    });
  });

  test.describe('Pricing Section', () => {
    test('should show pricing packages', async () => {
      await page.click('text=Pakete');
      const pricingSection = page.locator('#pricing');
      await expect(pricingSection).toBeVisible();

      const packages = await pricingSection.locator('.package-card').all();
      expect(packages.length).toBeGreaterThan(0);

      // Verify each package has required elements
      for (const pkg of packages) {
        await expect(pkg.locator('h3')).toBeVisible(); // Title
        await expect(pkg.locator('.price')).toBeVisible(); // Price
        await expect(pkg.locator('button')).toBeEnabled(); // CTA button
      }
    });
  });

  test.describe('Contact Form', () => {
    test('should validate form inputs', async () => {
      await page.goto('/contact');
      
      // Try submitting empty form
      await page.click('button[type="submit"]');
      await expect(page.locator('text=erforderlich')).toBeVisible();

      // Fill form with invalid data
      await page.fill('input[name="email"]', 'invalid-email');
      await page.click('button[type="submit"]');
      await expect(page.locator('text=gültige Email')).toBeVisible();

      // Fill form with valid data
      await page.fill('input[name="name"]', 'Test User');
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="subject"]', 'Test Subject');
      await page.fill('textarea[name="message"]', 'This is a test message');

      // Submit button should be enabled
      await expect(page.locator('button[type="submit"]')).toBeEnabled();
    });
  });

  test.describe('Performance & Accessibility', () => {
    test('should load images with correct attributes', async () => {
      const images = await page.locator('img').all();
      for (const img of images) {
        await expect(img).toHaveAttribute('alt');
        await expect(img).toHaveAttribute('loading', 'lazy');
      }
    });

    test('should have proper heading hierarchy', async () => {
      const h1Count = await page.locator('h1').count();
      expect(h1Count).toBe(1);

      const headings = await page.evaluate(() => {
        const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        return tags.map(tag => document.getElementsByTagName(tag).length);
      });
      
      expect(headings[0]).toBe(1); // Only one h1
      expect(headings[1]).toBeGreaterThan(0); // At least one h2
    });
  });

  test.describe('Error Handling', () => {
    test('should show 404 page for invalid routes', async () => {
      await page.goto('/non-existent-page');
      await expect(page.locator('text=404')).toBeVisible();
      await expect(page.locator('text=nicht gefunden')).toBeVisible();
    });
  });
});