import { test, expect } from '@playwright/test';

// NEW in 1.64: page.getByRef() — locate by the aria ref from ariaSnapshot({ mode: 'ai' })
// Before 1.64: get-by-ref/before-1-64/get-by-ref.spec.ts
test('getByRef: click the element an AI snapshot pointed at', async ({ page }) => {
  await page.goto('/widgets');

  // 1. The 'ai' snapshot gives every element a ref
  const snapshot = await page.ariaSnapshot({ mode: 'ai' });
  expect(snapshot).toContain('button "Subscribe" [ref=e27]');

  // 2. Use that ref as a locator (works only after a snapshot was taken)
  await page.getByRef('e27').click();
  await expect(page.locator('#subscribed')).toHaveText('Subscribed!');
});
