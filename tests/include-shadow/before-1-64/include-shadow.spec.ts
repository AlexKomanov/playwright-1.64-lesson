import { test, expect } from '@playwright/test';

// BEFORE 1.64: page.content() left the shadow root out. Locators could still read it.
// With 1.64: include-shadow/with-1-64/include-shadow.spec.ts
test('shadow DOM — missing from page.content(), readable with a locator', async ({ page }) => {
  await page.goto('/widgets');
  const html = await page.content();
  expect(html).not.toContain('shadowrootmode'); // no shadow root in the HTML
  await expect(page.locator('promo-banner'))
    .toContainText('Free shipping on orders over $50');
});
