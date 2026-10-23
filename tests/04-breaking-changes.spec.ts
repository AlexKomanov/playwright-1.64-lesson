import { test, expect, devices } from '@playwright/test';

// BREAKING in 1.64 #1: device descriptors now forward `screen`
// The chromium project already uses ...devices['Desktop Chrome'] (see playwright.config.ts)
test.describe('screen comes from the device descriptor', () => {
  test('window.screen is the emulated 1920×1080', async ({ page }) => {
    await page.goto('/widgets');
    await expect(page.locator('#screen-size')).toHaveText('1920×1080');
    await expect(page.locator('#viewport-size')).toHaveText('1280×720');
  });
});

// Opt out: set `screen` to undefined explicitly. In a config file that's
//   use: { ...devices['Desktop Chrome'], screen: undefined }
// Here we do the same thing on a context we create ourselves.
test('opt out with screen: undefined → screen follows the viewport again', async ({ browser, baseURL }) => {
  const context = await browser.newContext({ ...devices['Desktop Chrome'], screen: undefined, baseURL });
  const page = await context.newPage();
  await page.goto('/widgets');
  await expect(page.locator('#screen-size')).toHaveText('1280×720');
  await context.close();
});

// BREAKING in 1.64 #4: elements inside hidden iframes are considered hidden
test('a button inside a visibility:hidden iframe is hidden', async ({ page }) => {
  await page.goto('/widgets');
  const chatButton = page.frameLocator('#hidden-frame').getByRole('button', { name: 'Chat with us' });

  await expect(chatButton).toHaveCount(1);   // it IS in the DOM…
  await expect(chatButton).toBeHidden();     // …but since 1.64 it is NOT visible
  expect(await chatButton.isVisible()).toBe(false);
});
