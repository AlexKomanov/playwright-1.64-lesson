import { test } from '@playwright/test';
import { saveThemeAndCheck } from '../helpers/theme';

// BEFORE 1.64 (Test Locks arrived in 1.63): the lock is written on every test.
// Both tests change the same server setting, so they share the 'store-settings' lock
// and never run at the same time.

test('dark theme', { lock: 'store-settings' }, async ({ request }) => {
  await saveThemeAndCheck(request, 'dark');
});

test('light theme', { lock: 'store-settings' }, async ({ request }) => {
  await saveThemeAndCheck(request, 'light');
});
