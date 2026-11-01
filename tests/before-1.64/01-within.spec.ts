import { test, expect } from '@playwright/test';

// BEFORE 1.64 — the same checks as tests/01-within.spec.ts, written without locator.within().
// This still works in 1.64. It's here so the slides can show "before" and "after" side by side.

// Before: start from the parent (the dialog) and build the locator again inside it.
test('save settings', { lock: 'store-settings' }, async ({ page }) => {
  await page.goto('/settings');
  await page.getByRole('button', { name: 'Open store settings' }).click();

  const dialog = page.getByTestId('settings-dialog');
  await dialog.getByLabel('Theme').selectOption('light');
  await dialog.getByRole('button', { name: 'Save' }).click();

  await expect(dialog).toBeHidden();
  await expect(page.locator('#theme')).toHaveText('light');
});

// Before: a column needed a loop over the rows.
test('third column of every row', async ({ page }) => {
  await page.goto('/');

  const rows = page.getByRole('row').filter({ has: page.getByRole('cell') });
  const names: string[] = [];
  for (const row of await rows.all())
    names.push(await row.getByRole('cell').nth(2).innerText());
  expect(names).toEqual(['Apple', 'Banana', 'Cherry']);
});
