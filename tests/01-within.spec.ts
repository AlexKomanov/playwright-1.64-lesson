import { test, expect } from '@playwright/test';

// NEW in 1.64: locator.within(parent)
// "this button, within that dialog" — reads in the natural order.

// It changes the shared theme too, so it joins the 'store-settings' lock (see 02-locks-*.spec.ts)
test('save settings', { lock: 'store-settings' }, async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Open store settings' }).click();

  const saveButton = page.getByRole('button', { name: 'Save' }); // 2 matches!
  const dialog = page.getByTestId('settings-dialog');

  await expect(saveButton).toHaveCount(2);
  await expect(saveButton.within(dialog)).toHaveCount(1);

  await dialog.getByLabel('Theme').selectOption('light');
  await saveButton.within(dialog).click();

  await expect(dialog).toBeHidden();
  await expect(page.locator('#theme')).toHaveText('light');
});

// Without within(): nth(2) counts the cells of the whole table, so we get one cell.
test('third cell of the table', async ({ page }) => {
  await page.goto('/');
  const thirdCell = page.getByRole('cell').nth(2);
  await expect(thirdCell).toHaveText('Apple');
});

// With within(): nth(2) is resolved inside each row separately.
test('third column of every row', async ({ page }) => {
  await page.goto('/');

  // The third cell of every row, not the third cell in the table.
  const thirdColumn = page.getByRole('cell').nth(2)
    .within(page.getByRole('row'));
  await expect(thirdColumn).toHaveText(['Apple', 'Banana', 'Cherry']);
});

// The "before 1.64" versions of these tests: tests/before-1.64/01-within.spec.ts
