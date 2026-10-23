import { test, expect } from '@playwright/test';

// NEW in 1.64: page.getByRef() — locate by the aria ref from ariaSnapshot({ mode: 'ai' })
test('getByRef: click the element an AI snapshot pointed at', async ({ page }) => {
  await page.goto('/widgets');

  const snapshot = await page.ariaSnapshot({ mode: 'ai' });
  // e.g.  - button "Subscribe" [ref=e23]
  const ref = snapshot.match(/button "Subscribe" \[ref=(\w+)\]/)![1];
  console.log(`Subscribe button has ref ${ref}`);

  await page.getByRef(ref).click();
  await expect(page.locator('#subscribed')).toHaveText('Subscribed!');
});

// NEW in 1.64: page.content({ includeShadow: true }) — serialize open shadow roots
test('content() can include open shadow roots', async ({ page }) => {
  await page.goto('/widgets');

  const plain = await page.content();
  const withShadow = await page.content({ includeShadow: true });

  // Without the option, the shadow root is simply not in the HTML
  expect(plain).not.toContain('shadowrootmode');
  // With it, it is serialized as declarative shadow DOM: <template shadowrootmode="open">
  expect(withShadow).toContain('shadowrootmode="open"');
  expect(withShadow).toContain('Free shipping on orders over $50');
});

// NEW in 1.64: cookie methods on APIRequestContext
test('APIRequestContext: addCookies / cookies / clearCookies', async ({ request, baseURL }) => {
  expect((await request.get('/api/whoami')).status()).toBe(401);

  await request.addCookies([{ name: 'session-id', value: 'alex', url: baseURL! }]);
  expect(await (await request.get('/api/whoami')).json()).toEqual({ user: 'alex' });
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

// NEW in 1.64: unnamed toHaveScreenshot() stored as WebP (see expect.toHaveScreenshot in the config)
// First run: npx playwright test 03-new-apis --update-snapshots=missing  (now PASSES in 1.64)
test('promo banner looks right', async ({ page }) => {
  await page.goto('/widgets');
  await expect(page.locator('promo-banner')).toHaveScreenshot();
});
