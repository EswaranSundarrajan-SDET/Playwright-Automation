import { expect, test } from '../../fixtures/api';
import { apiNoteDraft } from '../../test-data/notes.data';
import type { Note, Profile } from '../../test-data/notes.types';
import { expectData, expectJson } from '../../utils/response';

test('Notes API reports a healthy service', async ({ notesApi }) => {
  // The health endpoint is public, so this test only needs the anonymous client.
  const body = await expectJson(await notesApi.health(), 200);
  expect(body.message).toBe('Notes API is Running');
});

test('registration and login provide an authenticated profile', async ({ notesAccount }) => {
  // Check that login and the protected profile endpoint both refer to the new account.
  const { account, session, client } = notesAccount;
  expect(session.email).toBe(account.email);
  const profile = await expectData<Profile>(await client.profile());
  expect(profile).toMatchObject({ id: session.id, name: account.name, email: account.email });
});

test('incorrect credentials are rejected', async ({ notesApi, notesAccount }) => {
  // Use a real test account with a wrong password to check the login error.
  const response = await notesApi.login({ ...notesAccount.account, password: 'Wrong-password-123' });
  const body = await expectJson(response, 401);
  expect(body.message).toMatch(/incorrect email address or password/i);
});

test('listing notes requires an access token', async ({ notesApi }) => {
  // Use the client without a token to check that the endpoint returns 401 Unauthorized.
  const body = await expectJson(await notesApi.list(), 401);
  expect(body.message).toMatch(/token/i);
});

test('invalid note category returns a validation error', async ({ notesAccount }) => {
  // Send a category outside the allowed list, then check for a validation error and an empty note list.
  const response = await notesAccount.client.create({ ...apiNoteDraft, category: 'Invalid' });
  const body = await expectJson(response, 400);
  expect(body.message).toMatch(/category/i);
  expect(await expectData<Note[]>(await notesAccount.client.list())).toEqual([]);
});

test('create, list, retrieve, replace, complete and delete a note', async ({ notesAccount }) => {
  const { client } = notesAccount;

  // Give each stage a name so it is easy to locate failures in the Playwright report.
  const note = await test.step('Create and retrieve the note', async () => {
    const created = await expectData<Note>(await client.create(apiNoteDraft));
    expect(created).toMatchObject({ ...apiNoteDraft, id: expect.any(String), completed: false });

    // Check that the new note can be found in the list and by its own ID.
    const allNotes = await expectData<Note[]>(await client.list());
    expect(allNotes).toEqual([expect.objectContaining({ id: created.id, ...apiNoteDraft })]);
    expect(await expectData<Note>(await client.get(created.id))).toMatchObject({ ...created });
    return created;
  });

  await test.step('Replace the note and patch its completion status', async () => {
    const update = { ...apiNoteDraft, title: 'Review the regression run', completed: false };
    const replaced = await expectData<Note>(await client.replace(note.id, update));
    expect(replaced).toMatchObject({ ...update, id: note.id });

    // Update only the completion flag and read the record again to check the saved result.
    const completed = await expectData<Note>(await client.setCompleted(note.id, true));
    expect(completed).toMatchObject({ ...update, id: note.id, completed: true });
    expect(await expectData<Note>(await client.get(note.id))).toMatchObject({ ...completed });
  });

  await test.step('Delete the note and verify removal', async () => {
    // Check the delete response and read the list again to confirm removal.
    await expectJson(await client.delete(note.id), 200);
    expect(await expectData<Note[]>(await client.list())).toEqual([]);
  });
});
