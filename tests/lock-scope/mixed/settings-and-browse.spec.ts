import { test } from '@playwright/test';
import { step } from '../timeline';

// ONE file with a test that needs the lock + two slow tests that don't.
// The file runs in default (not parallel) mode, so its tests run one after another
// and the lock is held until the LAST test in the file finishes (~5s),
// even though only the first test (1s) really needs it.
//
//   npm run test:lock-scope:mixed
test.describe.configure({ mode: 'default', lock: 'store-settings' });

test('settings test (needs the lock)', async () => {
  await step('settings test (needs the lock)', 1000);
});

test('browse products', async () => {
  await step('browse products', 2000);
});

test('view the cart', async () => {
  await step('view the cart', 2000);
});
