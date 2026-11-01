import { test, expect, type APIRequestContext } from '@playwright/test';

// ALSO IN 1.63: one lock for a group — wrap the tests in test.describe.
// In 1.64 there's no need to wrap: see tests/02-locks-configure.spec.ts.

// Saves a theme on the server, waits a little (time for a parallel test to interfere),
// and checks that the server still has our theme.
async function saveThemeAndCheck(request: APIRequestContext, theme: 'dark' | 'light') {
  await request.put('/api/settings', { data: { theme } });
  await new Promise(resolve => setTimeout(resolve, 500));
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme });
}

test.describe('store settings', { lock: 'store-settings' }, () => {
  test('dark theme', async ({ request }) => {
    await saveThemeAndCheck(request, 'dark');
  });

  test('light theme', async ({ request }) => {
    await saveThemeAndCheck(request, 'light');
  });
});
