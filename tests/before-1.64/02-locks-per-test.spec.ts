import { test, expect, type APIRequestContext } from '@playwright/test';

// BEFORE 1.64 (Test Locks arrived in 1.63): the lock is written on every test.
// Both tests change the same server setting, so they share the 'store-settings' lock
// and never run at the same time.

// Saves a theme on the server, waits a little (time for a parallel test to interfere),
// and checks that the server still has our theme.
async function saveThemeAndCheck(request: APIRequestContext, theme: 'dark' | 'light') {
  await request.put('/api/settings', { data: { theme } });
  await new Promise(resolve => setTimeout(resolve, 500));
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme });
}

test('dark theme', { lock: 'store-settings' }, async ({ request }) => {
  await saveThemeAndCheck(request, 'dark');
});

test('light theme', { lock: 'store-settings' }, async ({ request }) => {
  await saveThemeAndCheck(request, 'light');
});
