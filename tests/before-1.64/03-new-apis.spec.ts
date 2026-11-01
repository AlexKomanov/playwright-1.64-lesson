import { test, expect } from '@playwright/test';

// BEFORE 1.64 — how the same things were done without the new APIs in tests/03-new-apis.spec.ts.

// Before getByRef(): translate the snapshot line `- button "Subscribe"` into a role locator yourself.
test('click Subscribe — by role and name', async ({ page }) => {
  await page.goto('/widgets');
  await page.getByRole('button', { name: 'Subscribe' }).click();
  await expect(page.locator('#subscribed'))
    .toHaveText('Subscribed!');
});

// Before includeShadow: page.content() left the shadow root out. Locators could still read it.
test('shadow DOM — missing from page.content(), readable with a locator', async ({ page }) => {
  await page.goto('/widgets');
  const html = await page.content();
  expect(html).not.toContain('shadowrootmode'); // no shadow root in the HTML
  await expect(page.locator('promo-banner'))
    .toContainText('Free shipping on orders over $50');
});

// Before request.addCookies(): send the Cookie header yourself, on every request.
test('send a cookie — set the Cookie header yourself', async ({ request }) => {
  const res = await request.get('/api/whoami', {
    headers: { Cookie: 'session-id=alex' },
  });
  expect(await res.json()).toEqual({ user: 'alex' });
});
