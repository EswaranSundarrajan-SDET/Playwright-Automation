import type { Note, NoteDraft, Profile } from '../../src/api/notes-client';
import { expectData, expectJson } from '../../src/api/response';
import { expect, test } from '../../src/fixtures/api';

const draft: NoteDraft = {
  title: 'Plan the regression run',
  description: 'Verify the browser and API suites.',
  category: 'Work',
};

test('Notes API reports a healthy service', async ({ notesApi }) => {
  const body = await expectJson(await notesApi.health(), 200);
  expect(body.message).toBe('Notes API is Running');
});

test('registration and login provide an authenticated profile', async ({ notesAccount }) => {
  const { account, session, client } = notesAccount;
  expect(session.email).toBe(account.email);
  const profile = await expectData<Profile>(await client.profile());
  expect(profile).toMatchObject({ id: session.id, name: account.name, email: account.email });
});

test('incorrect credentials are rejected', async ({ notesApi, notesAccount }) => {
  const response = await notesApi.login({ ...notesAccount.account, password: 'Wrong-password-123' });
  const body = await expectJson(response, 401);
  expect(body.message).toMatch(/incorrect email address or password/i);
});

test('listing notes requires an access token', async ({ notesApi }) => {
  const body = await expectJson(await notesApi.list(), 401);
  expect(body.message).toMatch(/token/i);
});

test('invalid note category returns a validation error', async ({ notesAccount }) => {
  const response = await notesAccount.client.create({ ...draft, category: 'Invalid' });
  const body = await expectJson(response, 400);
  expect(body.message).toMatch(/category/i);
  expect(await expectData<Note[]>(await notesAccount.client.list())).toEqual([]);
});

test('create, list, retrieve, replace, complete and delete a note', async ({ notesAccount }) => {
  const { client } = notesAccount;

  const note = await test.step('Create and retrieve the note', async () => {
    const created = await expectData<Note>(await client.create(draft));
    expect(created).toMatchObject({ ...draft, id: expect.any(String), completed: false });

    const allNotes = await expectData<Note[]>(await client.list());
    expect(allNotes).toEqual([expect.objectContaining({ id: created.id, ...draft })]);
    expect(await expectData<Note>(await client.get(created.id))).toMatchObject(created);
    return created;
  });

  await test.step('Replace the note and patch its completion status', async () => {
    const update = { ...draft, title: 'Review the regression run', completed: false };
    const replaced = await expectData<Note>(await client.replace(note.id, update));
    expect(replaced).toMatchObject({ ...update, id: note.id });

    const completed = await expectData<Note>(await client.setCompleted(note.id, true));
    expect(completed).toMatchObject({ ...update, id: note.id, completed: true });
    expect(await expectData<Note>(await client.get(note.id))).toMatchObject(completed);
  });

  await test.step('Delete the note and verify removal', async () => {
    await expectJson(await client.delete(note.id), 200);
    expect(await expectData<Note[]>(await client.list())).toEqual([]);
  });
});
