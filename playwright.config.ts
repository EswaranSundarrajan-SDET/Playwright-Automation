import { defineConfig } from '@playwright/test';
import { apiBaseUrl, uiBaseUrl } from './config/environment';

/** True when the tests run on a build server such as GitHub Actions. */
const inCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: inCI,
  retries: inCI ? 1 : 0,
  workers: 2,
  timeout: 45_000,
  expect: { timeout: 10_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: uiBaseUrl, trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'api', testDir: './tests/api', use: { baseURL: apiBaseUrl } },
    { name: 'chromium', testDir: './tests/ui', use: { browserName: 'chromium' } },
    { name: 'firefox', testDir: './tests/ui', use: { browserName: 'firefox' } },
    { name: 'webkit', testDir: './tests/ui', use: { browserName: 'webkit' } },
  ],
});
