import { test as base, expect } from '@playwright/test';
import { NotesClient } from '../api/notes-client';
import { apiBaseURL } from '../config/environment';
import { createDemoAccount } from '../test-data/notes.data';
import type { Account, Session } from '../test-data/notes.types';
import { expectData, expectJson } from '../utils/response';

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
    const account = createDemoAccount();
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
