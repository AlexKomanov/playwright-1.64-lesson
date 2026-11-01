import { expect, type APIRequestContext } from '@playwright/test';

// Saves a theme on the server, waits a little (time for a parallel test to interfere),
// and checks that the server still has our theme.
export async function saveThemeAndCheck(request: APIRequestContext, theme: 'dark' | 'light') {
  await request.put('/api/settings', { data: { theme } });
  await new Promise(resolve => setTimeout(resolve, 500));
  const settings = await (await request.get('/api/settings')).json();
  expect(settings).toEqual({ theme });
}
