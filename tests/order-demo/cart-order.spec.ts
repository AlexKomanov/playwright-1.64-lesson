import { test, expect } from '@playwright/test';

// A BAD test file on purpose: test #2 silently depends on test #1.
// In declaration order it is green. With --shuffle it fails ~half the time.
//
//   npx playwright test --project=order-demo --workers=1             # green
//   npx playwright test --project=order-demo --workers=1 --shuffle   # sometimes red
//   npx playwright test --project=order-demo --workers=1 --shuffle <seed>  # replay that order
//
// Note: --shuffle reorders test files and tests in parallel mode (fullyParallel is on in the config).
// Tests that share a beforeAll/afterAll hook stay together as one group, so this file has none.

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
