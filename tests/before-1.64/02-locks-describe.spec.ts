import { test, expect } from '@playwright/test';

// BEFORE 1.64 (1.63): one lock for a whole group — wrap the tests in test.describe.
// In 1.64 the same thing is one line at the top of the file: see tests/02-locks-a.spec.ts.

test.describe('store settings', { lock: 'store-settings' }, () => {
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
});
