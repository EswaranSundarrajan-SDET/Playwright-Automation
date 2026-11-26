import { defineConfig, devices } from '@playwright/test';

import { apiBaseURL, uiBaseURL } from './config/expandtesting';
import type { FrameworkOptions } from './fixtures/base';

// GitHub Actions sets CI. Use it to choose the runner settings and report format.
const ci = Boolean(process.env.CI);

export default defineConfig<FrameworkOptions>({
  // Look for tests under this folder. Each project below chooses which spec files to run.
  testDir: './tests',
  // Allow individual tests in a file to run in parallel and be split across CI jobs.
  fullyParallel: true,
  // Fail CI if test.only would cause the runner to skip other tests.
  forbidOnly: ci,
  // CI gives a failing test one retry. Local runs show the failure on the first attempt.
  retries: ci ? 1 : 0,
  // Use two local workers. CI runs one worker per job and gets parallelism from the job matrix.
  workers: ci ? 1 : 2,
  // The test and its setup get 45 seconds. An expect check can wait up to 10 seconds for a condition.
  timeout: 45_000,
  expect: { timeout: 10_000 },
  // CI saves a mergeable report for each job. Local runs save an HTML report.
  reporter: ci ? [['line'], ['blob']] : [['list'], ['html', { open: 'never' }]],
  // Share the site address, browser time limits, and failure evidence settings across projects.
  use: {
    baseURL: uiBaseURL,
    apiBaseURL,
    actionTimeout: 12_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
  // Run the API specs once. Run the same UI and hybrid specs in each of the three browser engines.
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
