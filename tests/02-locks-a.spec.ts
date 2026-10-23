import { test, expect } from '@playwright/test';

// NEW in 1.64: test.describe.configure({ lock }) — locks for a whole file / group.
// 02-locks-a and 02-locks-b both change the SAME server-side setting.
// With fullyParallel they would race. The shared lock makes them take turns,
// while every other test keeps running in parallel.
// Try it: comment out the next line in both files and run them a few times.
test.describe.configure({ lock: 'store-settings' });

test('switch theme to dark', async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Open store settings' }).click();
  const dialog = page.getByTestId('settings-dialog');
  await dialog.getByLabel('Theme').selectOption('dark');
  await page.getByRole('button', { name: 'Save' }).within(dialog).click();

  await page.waitForTimeout(800); // a slow app — gives a parallel test time to interfere
  await page.reload();
  await expect(page.locator('#theme')).toHaveText('dark');
});
