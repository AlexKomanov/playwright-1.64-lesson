import { test } from '@playwright/test';
import { saveThemeAndCheck } from '../helpers/theme';

// ALSO IN 1.63: one lock for a group — wrap the tests in test.describe.
// In 1.64 there's no need to wrap: see tests/02-locks-configure.spec.ts.

test.describe('store settings', { lock: 'store-settings' }, () => {
  test('dark theme', async ({ request }) => {
    await saveThemeAndCheck(request, 'dark');
  });

  test('light theme', async ({ request }) => {
    await saveThemeAndCheck(request, 'light');
  });
});
