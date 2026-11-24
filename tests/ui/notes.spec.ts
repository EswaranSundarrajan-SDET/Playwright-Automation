import type { Note, NoteDraft } from '../../src/api/notes-client';
import { expectData } from '../../src/api/response';
import { expect, test } from '../../src/fixtures/ui';

test('API-seeded notes appear in the UI and UI-created notes persist to the API', async ({
  ui, notesAccount,
}) => {
  // Create a starting note through the API with the temporary user's account.
  const draft: NoteDraft = {
    title: 'Seeded by the API',
    description: 'This note should appear after browser login.',
    category: 'Home',
  };
  await expectData<Note>(await notesAccount.client.create(draft));

  await ui.notes.goto();
  // Sign in as the same user so the browser can see the note created by the API.
  await ui.notes.login(notesAccount.account);
  await expect(ui.notes.title(draft.title)).toBeVisible();

  // Create a second note through the browser and check that it appears on the page.
  const fromBrowser: NoteDraft = {
    title: 'Created in the browser',
    description: 'Verify the saved note through the REST API.',
    category: 'Work',
  };
  await ui.notes.createNote(fromBrowser);
  await expect(ui.notes.title(fromBrowser.title)).toBeVisible();

  // Read the notes from the API to confirm the browser action saved the second note.
  const saved = await expectData<Note[]>(await notesAccount.client.list());
  expect(saved).toEqual(expect.arrayContaining([
    expect.objectContaining({ ...fromBrowser, completed: false }),
  ]));
});
