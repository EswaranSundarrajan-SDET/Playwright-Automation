import { test as base } from '@playwright/test';
import { ApiClient } from '../api/api-client';

// Set this in the Playwright config or override it for a suite with test.use().
export type FrameworkOptions = {
  apiBaseURL: string | undefined;
};

export const test = base.extend<FrameworkOptions & { apiClient: ApiClient }>({
  apiBaseURL: [undefined, { option: true }],

  // Open a fresh HTTP context when a test asks for the client. It works without a browser.
  apiClient: async ({ playwright, apiBaseURL }, use) => {
    const context = await playwright.request.newContext({
      baseURL: apiBaseURL,
      timeout: 12_000,
    });

    try {
      await use(new ApiClient(context));
    } finally {
      await context.dispose();
    }
  },
});

export { expect } from '@playwright/test';
