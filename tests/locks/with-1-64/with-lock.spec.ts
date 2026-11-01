import { test, expect } from '@playwright/test';

// Two tests change the same setting on the server: the theme of the store.
// NEW in 1.64: one line gives every test in this file the same lock,
// so these two tests never run at the same time.
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
