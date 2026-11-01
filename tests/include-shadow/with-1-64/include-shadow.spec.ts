import { test, expect } from '@playwright/test';

// NEW in 1.64: page.content({ includeShadow: true }) — serialize open shadow roots
// Before 1.64: include-shadow/before-1-64/include-shadow.spec.ts
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
