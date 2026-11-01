import { test, expect } from '@playwright/test';

// BEFORE 1.64 (Test Locks arrived in 1.63): a lock on each test.
// Both tests change the same server setting, so they share the 'store-settings' lock
// and never run at the same time.

test('switch theme to dark', { lock: 'store-settings' }, async ({ request }) => {
  await request.put('/api/settings', { data: { theme: 'dark' } });
  await new Promise(resolve => setTimeout(resolve, 500)); // another test could change it meanwhile
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme: 'dark' });
});

test('switch theme to light', { lock: 'store-settings' }, async ({ request }) => {
  await request.put('/api/settings', { data: { theme: 'light' } });
  await new Promise(resolve => setTimeout(resolve, 500));
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme: 'light' });
});
