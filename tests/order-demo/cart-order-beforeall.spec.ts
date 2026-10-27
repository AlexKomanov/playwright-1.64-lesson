import { test, expect } from '@playwright/test';

// The SAME hidden dependency as cart-order.spec.ts — test #2 still needs test #1.
// The only difference: the tests share a beforeAll.
//
// Playwright keeps tests that share a beforeAll/afterAll together, in the order they are written,
// so --shuffle never puts test #2 first and the dependency stays hidden.
//
//   npm run test:shuffle:beforeall    # green every time — shuffle can't catch this one
//   npm run test:shuffle              # the version without beforeAll — red in some runs

test.beforeAll(async ({ request }) => {
  await request.delete('/api/cart');
});

test('add an apple to the cart', async ({ request }) => {
  const res = await request.post('/api/cart', { data: { productId: 1, quantity: 1 } });
  expect(res.ok()).toBeTruthy();
});

test('cart shows one item', async ({ page }) => {
  await page.goto('/');
  // Hidden dependency: only true if the previous test already ran.
  await expect(page.locator('#cart-count')).toHaveText('1');
});
