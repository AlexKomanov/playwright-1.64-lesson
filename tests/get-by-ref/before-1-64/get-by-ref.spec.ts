import { test, expect } from '@playwright/test';

// BEFORE 1.64: translate the snapshot line `- button "Subscribe"` into a role locator yourself.
// With 1.64: get-by-ref/with-1-64/get-by-ref.spec.ts
test('click Subscribe — by role and name', async ({ page }) => {
  await page.goto('/widgets');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(page.locator('#subscribed'))
    .toHaveText('Subscribed!');
});
