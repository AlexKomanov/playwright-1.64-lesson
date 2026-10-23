import { test, expect } from '@playwright/test';

// Same lock name as 02-locks-a.spec.ts → these never run at the same time.
test.describe.configure({ lock: 'store-settings' });

test('switch theme to light', async ({ page, request }) => {
  await request.put('/api/settings', { data: { theme: 'light' } });

  await page.waitForTimeout(800);
  await page.goto('/settings');
  await expect(page.locator('#theme')).toHaveText('light');
});

// Per-test lock syntax (from the 1.63 docs) — the built-in 'exclusive' lock
// runs a test with nothing else running at the same time.
test('reset settings in isolation', { lock: 'exclusive' }, async ({ request }) => {
  const res = await request.put('/api/settings', { data: { theme: 'light' } });
  expect(await res.json()).toEqual({ theme: 'light' });
});
