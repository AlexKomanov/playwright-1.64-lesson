import { test, expect } from '@playwright/test';

// NEW in 1.64: cookie methods on APIRequestContext
// Before 1.64: request-cookies/before-1-64/request-cookies.spec.ts
test('APIRequestContext: addCookies / cookies / clearCookies', async ({ request, baseURL }) => {
  expect((await request.get('/api/whoami')).status()).toBe(401);

  await request.addCookies([
    { name: 'session-id', value: 'alex', url: baseURL! },
  ]);
  const me = await (await request.get('/api/whoami')).json();
  expect(me).toEqual({ user: 'alex' });
  console.log(await request.cookies(baseURL!));

  await request.clearCookies({ name: 'session-id' });
  expect((await request.get('/api/whoami')).status()).toBe(401);
});

// Cookies set by the server (Set-Cookie) land in the same jar
test('APIRequestContext: cookies() sees a Set-Cookie from login', async ({ request, baseURL }) => {
  await request.post('/api/login', { data: { user: 'dana' } });
  const cookies = await request.cookies(baseURL!);
  expect(cookies.find(c => c.name === 'session-id')?.value).toBe('dana');
});
