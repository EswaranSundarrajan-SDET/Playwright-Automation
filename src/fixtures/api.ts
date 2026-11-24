import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { NotesClient, type Account, type Session } from '../api/notes-client';
import { expectData, expectJson } from '../api/response';
import { apiBaseURL } from '../targets';

// The test gets the account details, the login response, and a client that can send the token.
type NotesAccount = {
  account: Account;
  session: Session;
  client: NotesClient;
};

// Add two fixtures to Playwright's built-in test. Playwright sets them up when a test or another fixture
// asks for them.
export const test = base.extend<{ notesApi: NotesClient; notesAccount: NotesAccount }>({
  // Create a fresh HTTP session for each test that needs the API. This works without opening a browser.
  notesApi: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: apiBaseURL,
      extraHTTPHeaders: { accept: 'application/json' },
      timeout: 12_000,
    });
    try {
      // Give the client to the test. Code after use runs during cleanup.
      await use(new NotesClient(context));
    } finally {
      // Release the request context and the responses it is holding, even when the test fails.
      await context.dispose();
    }
  },
  // This fixture depends on notesApi. It creates and signs in a new demo user for the test.
  notesAccount: async ({ notesApi }, use) => {
    // Use a short random ID to stay within the demo's field limits and avoid sharing accounts across
    // parallel tests.
    const id = randomUUID().replaceAll('-', '').slice(0, 20);
    const account: Account = {
      name: 'Playwright QA',
      email: `pw-${id}@example.com`,
      password: `Pw!-${id}`,
    };

    await expectJson(await notesApi.register(account), 201);
    const session = await expectData<Session>(await notesApi.login(account));
    expect(session.token).toMatch(/\S/);
    // Use the login token for requests that need an authenticated user.
    const client = notesApi.withToken(session.token);

    try {
      await use({ account, session, client });
    } finally {
      // After a successful login, try to remove the test account during cleanup, even if a test
      // assertion fails.
      await expectJson(await client.deleteAccount(), 200);
    }
  },
});

// Export Playwright's assertions so specs can import test and expect from the same file.
export { expect };
