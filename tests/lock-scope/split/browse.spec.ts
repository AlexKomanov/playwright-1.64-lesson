import { test } from '@playwright/test';
import { step } from '../timeline';

// The tests that don't need the lock moved to their own file — no lock here.
test.describe.configure({ mode: 'default' });

test('browse products', async () => {
  await step('browse products', 2000);
});

test('view the cart', async () => {
  await step('view the cart', 2000);
});
