import { test, expect } from '@playwright/test';

// NEW in 1.64: unnamed toHaveScreenshot() stored as WebP (see expect.toHaveScreenshot in the config)
test('promo banner looks right', async ({ page }) => {
  await page.goto('/widgets');
  await expect(page.locator('promo-banner')).toHaveScreenshot();
});
