import { test, expect } from '@playwright/test';

// NEW in 1.64: the same two tests as tests/before-1.64/02-locks-describe.spec.ts,
// but the lock for the whole file is one line — no describe wrapper.

test.describe.configure({ lock: 'store-settings' });

test('switch theme to dark', async ({ request }) => {
  await request.put('/api/settings', { data: { theme: 'dark' } });
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme: 'dark' });
});

test('switch theme to light', async ({ request }) => {
  await request.put('/api/settings', { data: { theme: 'light' } });
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme: 'light' });
});
