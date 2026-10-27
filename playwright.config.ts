import { defineConfig, devices } from '@playwright/test';

// Playwright 1.64 lesson config.
//   npx playwright test                    → runs only the projects WITHOUT `default: false`
//   npx playwright test --project=firefox  → runs one opt-in project
//   npx playwright test --project="*"      → runs every project (e.g. on CI)
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: [['list'], ['html', { open: 'never' }]],
  globalSetup: './tests/global-setup.ts',

  use: {
    baseURL: 'http://localhost:3164',
    trace: 'retain-on-failure',
  },

  expect: {
    // NEW in 1.64: store unnamed toHaveScreenshot() baselines as WebP
    toHaveScreenshot: { type: 'webp' },
  },

  webServer: {
    command: 'node demo-app/server.js',
    url: 'http://localhost:3164',
    reuseExistingServer: true,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/order-demo/**', '**/lock-scope/**', '**/webmcp.spec.ts'],
    },
    {
      // WebMCP is experimental: Chromium needs a feature flag
      name: 'webmcp',
      use: { ...devices['Desktop Chrome'], launchOptions: { args: ['--enable-features=WebMCP'] } },
      testMatch: '**/webmcp.spec.ts',
    },

    // ---- NEW in 1.64: configured, but NOT part of a plain `npx playwright test` ----
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testMatch: '**/01-within.spec.ts',
      default: false,
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testMatch: '**/01-within.spec.ts',
      default: false,
    },
    {
      // How long a file-level lock is held — prints a timeline
      name: 'lock-scope',
      testMatch: '**/lock-scope/**/*.spec.ts',
      default: false,
    },
    {
      // Order-dependent tests on purpose — run with --shuffle to expose them
      name: 'order-demo',
      testMatch: '**/order-demo/**',
      default: false,
    },
    {
      // NEW in 1.64: video fps + CSS-styled action decorations
      name: 'video',
      testMatch: '**/01-within.spec.ts',
      default: false,
      use: {
        ...devices['Desktop Chrome'],
        video: {
          mode: 'on',
          size: { width: 1280, height: 720 },
          fps: 60,
          show: {
            actions: {
              style: {
                point: 'width: 20px; height: 20px; border-radius: 50%; background: red',
                highlight: 'outline: 2px solid #333; background: rgba(0, 128, 255, .15)',
                title: 'font-size: 16px',
              },
            },
          },
        },
      },
    },
  ],
});
