import { test } from '@playwright/test';
import { step } from './timeline';

// Another test that changes store settings, in a different file.
// It needs the same lock, so it can only start when the lock is free.
// Watch its start time: ~5s with the mixed file, ~1s with the split files.
test('another settings test', { lock: 'store-settings' }, async () => {
  await step('another settings test', 1000);
});
