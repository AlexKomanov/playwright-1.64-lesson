import { test, expect } from '@playwright/test';

// NEW in 1.64: locator.within(parent)
// "this button, within that dialog" — reads in the natural order.

// It changes the shared theme too, so it joins the 'store-settings' lock (see 02-locks-*.spec.ts)
test('save the store settings — the Save button inside the dialog', { lock: 'store-settings' }, async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Open store settings' }).click();

  const saveButton = page.getByRole('button', { name: 'Save' }); // 2 matches on the page!
  const dialog = page.getByTestId('settings-dialog');

  await expect(saveButton).toHaveCount(2);
  await expect(saveButton.within(dialog)).toHaveCount(1);

  await dialog.getByLabel('Theme').selectOption('light');
  await saveButton.within(dialog).click();

  await expect(dialog).toBeHidden();
  await expect(page.locator('#theme')).toHaveText('light');
});

test('third column of every row — relative locators resolve per parent', async ({ page }) => {
  await page.goto('/');

  // The third cell of every row, not the third cell in the table.
  const thirdColumn = page.getByRole('cell').nth(2).within(page.getByRole('row'));
  await expect(thirdColumn).toHaveText(['Apple', 'Banana', 'Cherry']);
});

test('before 1.64 — the same thing needed the parent first', async ({ page }) => {
  await page.goto('/');

  // Old way: loop over rows, or chain from the parent: row.getByRole('cell').nth(2)
  const names: string[] = [];
  for (const row of await page.getByRole('row').filter({ has: page.getByRole('cell') }).all())
    names.push(await row.getByRole('cell').nth(2).innerText());
  expect(names).toEqual(['Apple', 'Banana', 'Cherry']);
});
