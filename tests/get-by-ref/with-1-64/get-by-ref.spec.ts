import { test, expect } from '@playwright/test';

// NEW in 1.64: page.getByRef() — locate by the aria ref from ariaSnapshot({ mode: 'ai' })
// Before 1.64: get-by-ref/before-1-64/get-by-ref.spec.ts
test('getByRef: click the element an AI snapshot pointed at', async ({ page }) => {
  await page.goto('/widgets');

  const snapshot = await page.ariaSnapshot({ mode: 'ai' });
  // e.g.  - button "Subscribe" [ref=e27] [cursor=pointer]
  const ref = snapshot
    .match(/button "Subscribe" \[ref=(\w+)\]/)![1];
  console.log(`Subscribe button has ref ${ref}`);

  await page.getByRef(ref).click();
  await expect(page.locator('#subscribed')).toHaveText('Subscribed!');
});
