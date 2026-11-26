import { expectNotesData } from '../../api/expandtesting/notes-response';
import { expect, test } from '../../fixtures/expandtesting/ui';
import { browserNote, seededNote } from '../../test-data/expandtesting/notes.data';
import type { Note } from '../../test-data/expandtesting/notes.types';

test('API-seeded notes appear in the UI and UI-created notes persist to the API', async ({
  ui, notesAccount,
}) => {
  // Create a starting note through the API with the temporary user's account.
  await expectNotesData<Note>(await notesAccount.client.create(seededNote));

  await ui.notes.goto();
  // Sign in as the same user so the browser can see the note created by the API.
  await ui.notes.login(notesAccount.account);
  await expect(ui.notes.title(seededNote.title)).toBeVisible();

  // Create a second note through the browser and check that it appears on the page.
  await ui.notes.createNote(browserNote);
  await expect(ui.notes.title(browserNote.title)).toBeVisible();

  // Read the notes from the API to confirm the browser action saved the second note.
  const saved = await expectNotesData<Note[]>(await notesAccount.client.list());
  expect(saved).toEqual(expect.arrayContaining([
    expect.objectContaining({ ...browserNote, completed: false }),
  ]));
});
