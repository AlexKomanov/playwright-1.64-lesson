import { test, expect } from '@playwright/test';

// NEW in 1.64: page.webmcp — list and call the tools a page registers
// through the experimental WebMCP API (navigator.modelContext / document.modelContext).
// Runs in the `webmcp` project, which launches Chromium with --enable-features=WebMCP.
// No LLM involved: this is a deterministic "tool contract" test.

test.describe.configure({ lock: 'cart' });

test.beforeEach(async ({ request, page }) => {
  await request.delete('/api/cart');
  await page.goto('/');
  await expect(page.locator('#webmcp-status')).toHaveText('tools registered');
});

test('the shop registers the expected tools', async ({ page }) => {
  const tools = await page.webmcp.tools();
  const names = tools.map(t => t.name).sort();
  expect(names).toEqual(['add_to_cart', 'get_cart', 'search_products']);

  const search = tools.find(t => t.name === 'search_products')!;
  expect(search.annotations?.readOnly).toBe(true);
  expect(search.inputSchema).toMatchObject({ required: ['query'] });
});

test('add_to_cart works — and the UI agrees with the tool', async ({ page, request }) => {
  const result = await page.webmcp.callTool('add_to_cart', { productId: 2, quantity: 2 });
  expect(result.isError).not.toBe(true);

  const cart = JSON.parse(result.content[0].text);
  expect(cart).toMatchObject({ totalItems: 2, totalPrice: 15 });

  // Don't trust the tool's own report only — check the visible UI and the backend too.
  await expect(page.locator('#cart-count')).toHaveText('2');
  const backend = await (await request.get('/api/cart')).json();
  expect(backend.totalItems).toBe(2);
});

test('a bad product id comes back as isError, not as a fake success', async ({ page }) => {
  const result = await page.webmcp.callTool('add_to_cart', { productId: 999, quantity: 1 });
  expect(result.isError).toBe(true);
  expect(result.content[0].text).toBe('unknown product');
});
