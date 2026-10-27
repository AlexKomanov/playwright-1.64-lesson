import { test } from '@playwright/test';
import { step } from '../timeline';

// The fix: only the test that needs the lock stays in the locked file (~1s).
//
//   npm run test:lock-scope:split
test.describe.configure({ mode: 'default', lock: 'store-settings' });

test('settings test (needs the lock)', async () => {
  await step('settings test (needs the lock)', 1000);
});
