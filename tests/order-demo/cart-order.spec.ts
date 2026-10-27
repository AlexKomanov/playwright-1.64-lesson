import { test, expect } from '@playwright/test';

// A BAD test file on purpose: tests #3 and #4 silently depend on tests #1 and #2.
// In declaration order it is green. With --shuffle it fails in many runs.
//
//   npm run test:shuffle                    # random order — often red
//   npm run test:shuffle -- <seed>          # replay the order of a failed run
//
// Note: --shuffle reorders test files and tests in parallel mode (fullyParallel is on in the config).
// Compare with cart-order-beforeall.spec.ts: the same tests with a shared beforeAll are never reordered.

test('1: add an apple to the cart', async ({ request }) => {
  await request.delete('/api/cart');
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
