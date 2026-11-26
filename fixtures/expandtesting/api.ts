import { NotesClient } from '../../api/expandtesting/notes-client';
import { expectNotesData, expectNotesResponse } from '../../api/expandtesting/notes-response';
import { createDemoAccount } from '../../test-data/expandtesting/notes.data';
import type { Account, Session } from '../../test-data/expandtesting/notes.types';
import { test as base, expect } from '../base';

// The test gets the account details, the login response, and a client that can send the token.
type NotesAccount = {
  account: Account;
  session: Session;
  client: NotesClient;
};

// Add Notes fixtures to the shared test. Playwright sets them up when a test asks for them.
export const test = base.extend<{ notesApi: NotesClient; notesAccount: NotesAccount }>({
  // Give the shared API client the headers expected by the Notes service.
  notesApi: async ({ apiClient }, use) => {
    await use(new NotesClient(apiClient.withHeaders({ accept: 'application/json' })));
  },
  // This fixture depends on notesApi. It creates and signs in a new demo user for the test.
  notesAccount: async ({ notesApi }, use) => {
    const account = createDemoAccount();
    await expectNotesResponse(await notesApi.register(account), 201);
    const session = await expectNotesData<Session>(await notesApi.login(account));
    expect(session.token).toMatch(/\S/);
    // Use the login token for requests that need an authenticated user.
    const client = notesApi.withToken(session.token);

    try {
      await use({ account, session, client });
    } finally {
      // After a successful login, try to remove the test account during cleanup, even if a test
      // assertion fails.
      await expectNotesResponse(await client.deleteAccount(), 200);
    }
  },
});

// Export Playwright's assertions so specs can import test and expect from the same file.
export { expect };
