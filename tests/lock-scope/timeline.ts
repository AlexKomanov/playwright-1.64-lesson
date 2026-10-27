import { test } from '@playwright/test';

// Prints when a test starts and ends, in seconds since the run started,
// so the console output reads like a timeline.
const t = () => `${((Date.now() - Number(process.env.RUN_STARTED_AT)) / 1000).toFixed(1)}s`;

export async function step(name: string, ms: number) {
  const start = t();
  await new Promise(resolve => setTimeout(resolve, ms));
  console.log(`  [${start} → ${t()}]  worker ${test.info().workerIndex}  ${name}`);
}
