import { test, expect } from '@playwright/test';

// BEFORE 1.64: send the Cookie header yourself, on every request.
// With 1.64: request-cookies/with-1-64/request-cookies.spec.ts
test('send a cookie — set the Cookie header yourself', async ({ request }) => {
  const res = await request.get('/api/whoami', {
    headers: { Cookie: 'session-id=alex' },
  });
  expect(await res.json()).toEqual({ user: 'alex' });
});
