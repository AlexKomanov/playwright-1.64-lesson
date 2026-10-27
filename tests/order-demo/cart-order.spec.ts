import { test, expect } from '@playwright/test';

// A BAD test file on purpose: test #2 silently depends on test #1.
// In declaration order it is green. With --shuffle it fails in some runs.
//
//   npm run test:shuffle                    # random order — sometimes red
//   npm run test:shuffle -- <seed>          # replay the order of a failed run
//
// Note: --shuffle reorders test files and tests in parallel mode (fullyParallel is on in the config).
// Compare with cart-order-beforeall.spec.ts: the same tests with a shared beforeAll are never reordered.

test('add an apple to the cart', async ({ request }) => {
  await request.delete('/api/cart');
  const res = await request.post('/api/cart', { data: { productId: 1, quantity: 1 } });
  expect(res.ok()).toBeTruthy();
});

test('cart shows one item', async ({ page }) => {
  await page.goto('/');
  // Hidden dependency: only true if the previous test already ran.
  await expect(page.locator('#cart-count')).toHaveText('1');
});
