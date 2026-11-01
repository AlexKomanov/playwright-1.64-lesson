import { test, expect, type APIRequestContext } from '@playwright/test';

// NEW in 1.64: the same two tests as tests/before-1.64/02-locks-per-test.spec.ts,
// but the lock is one line for the whole file.

// Saves a theme on the server, waits a little (time for a parallel test to interfere),
// and checks that the server still has our theme.
async function saveThemeAndCheck(request: APIRequestContext, theme: 'dark' | 'light') {
  await request.put('/api/settings', { data: { theme } });
  await new Promise(resolve => setTimeout(resolve, 500));
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme });
}

test.describe.configure({ lock: 'store-settings' });

test('dark theme', async ({ request }) => {
  await saveThemeAndCheck(request, 'dark');
});

test('light theme', async ({ request }) => {
  await saveThemeAndCheck(request, 'light');
});
