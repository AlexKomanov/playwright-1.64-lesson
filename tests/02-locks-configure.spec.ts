import { test } from '@playwright/test';
import { saveThemeAndCheck } from './helpers/theme';

// NEW in 1.64: the same two tests as tests/before-1.64/02-locks-per-test.spec.ts,
// but the lock is one line for the whole file.

test.describe.configure({ lock: 'store-settings' });

test('dark theme', async ({ request }) => {
  await saveThemeAndCheck(request, 'dark');
});

test('light theme', async ({ request }) => {
  await saveThemeAndCheck(request, 'light');
});
