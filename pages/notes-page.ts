import type { Credentials, NoteDraft } from '../test-data/notes.types';
import { PracticePage } from './practice-page';

// The Notes app has its own login and note creation form. The hybrid spec uses this page object.
export class NotesPage extends PracticePage {
  protected readonly path = '/notes/app/login';
  readonly addNote = this.page.getByRole('button', { name: '+ Add Note', exact: true });

  // Sign in with the demo account from the API fixture.
  async login({ email, password }: Credentials) {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    // Wait for the Add Note button to show that the notes screen is ready.
    await this.addNote.waitFor();
  }

  // Open the note form, enter its fields, and submit it.
  async createNote(note: NoteDraft) {
    await this.addNote.click();
    // Use the stable name attributes to find the three form fields.
    await this.page.locator('select[name="category"]').selectOption(note.category);
    await this.page.locator('input[name="title"]').fill(note.title);
    await this.page.locator('textarea[name="description"]').fill(note.description);
    await this.page.getByTestId('note-submit').click();
  }

  // Find the exact title so a different note with a similar name cannot match.
  title(text: string) {
    return this.page.getByText(text, { exact: true });
  }
}
