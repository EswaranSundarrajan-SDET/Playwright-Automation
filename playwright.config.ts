import { defineConfig, devices } from '@playwright/test';

import { uiBaseURL } from './src/targets';

const ci = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: ci,
  retries: ci ? 1 : 0,
  workers: ci ? 1 : 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: ci ? [['line'], ['blob']] : [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: uiBaseURL,
    actionTimeout: 12_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  projects: [
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
    },
    {
      name: 'chromium',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      testMatch: '**/ui/**/*.spec.ts',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
