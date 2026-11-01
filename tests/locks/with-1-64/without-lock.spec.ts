import { test, expect } from '@playwright/test';

// The same two tests as with-lock.spec.ts, WITHOUT the lock line.
// They run at the same time, one overwrites the theme of the other,
// and one of them fails — even though the app has no bug.

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
