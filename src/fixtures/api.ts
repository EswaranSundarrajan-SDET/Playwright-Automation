import { randomUUID } from 'node:crypto';
import { test as base, expect } from '@playwright/test';
import { NotesClient, type Account, type Session } from '../api/notes-client';
import { expectData, expectJson } from '../api/response';
import { apiBaseURL } from '../targets';

type NotesAccount = {
  account: Account;
  session: Session;
  client: NotesClient;
};

export const test = base.extend<{ notesApi: NotesClient; notesAccount: NotesAccount }>({
  notesApi: async ({ playwright }, use) => {
    const context = await playwright.request.newContext({
      baseURL: apiBaseURL,
      extraHTTPHeaders: { accept: 'application/json' },
      timeout: 12_000,
    });
    try {
      await use(new NotesClient(context));
    } finally {
      await context.dispose();
    }
  },
  notesAccount: async ({ notesApi }, use) => {
    const id = randomUUID();
    const account: Account = {
      name: 'Playwright QA',
      email: `pw-${id}@example.com`,
      password: `Pw!-${id}`,
    };

    await expectJson(await notesApi.register(account), 201);
    const session = await expectData<Session>(await notesApi.login(account));
    expect(session.token).toMatch(/\S/);
    const client = notesApi.withToken(session.token);

    try {
      await use({ account, session, client });
    } finally {
      await expectJson(await client.deleteAccount(), 200);
    }
  },
});

export { expect };
