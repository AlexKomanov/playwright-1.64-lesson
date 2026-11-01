import { test, expect } from '@playwright/test';

// The SAME hidden dependency as cart-order.spec.ts — tests #3 and #4 still need tests #1 and #2.
// The only difference: the tests share a beforeAll.
//
// Playwright keeps tests that share a beforeAll/afterAll together, in the order they are written,
// so --shuffle never moves #3 or #4 ahead of #1 and #2, and the dependency stays hidden.
//
//   npm run test:shuffle:beforeall    # green every time — shuffle can't catch this one
//   npm run test:shuffle              # the version without beforeAll — often red

test.beforeAll(async ({ request }) => {
  await request.delete('/api/cart');
});

test('1: add an apple to the cart', async ({ request }) => {
  const res = await request.post('/api/cart', { data: { productId: 1, quantity: 1 } });
  expect(res.ok()).toBeTruthy();
});

test('2: add a banana to the cart', async ({ request }) => {
  const res = await request.post('/api/cart', { data: { productId: 2, quantity: 1 } });
  expect(res.ok()).toBeTruthy();
});

test('3: cart shows two items', async ({ page }) => {
  await page.goto('/');
  // Hidden dependency: only true if tests #1 and #2 already ran.
  await expect(page.locator('#cart-count')).toHaveText('2');
});

test('4: cart total is $12.5', async ({ page }) => {
  await page.goto('/');
  // Hidden dependency: apple ($5) + banana ($7.5) from tests #1 and #2.
  await expect(page.locator('#cart-total')).toHaveText('$12.5');
});
