import type { Credentials, NoteDraft } from '../api/notes-client';
import { PracticePage } from './practice-page';

export class NotesPage extends PracticePage {
  protected readonly path = '/notes/app/login';
  readonly addNote = this.page.getByRole('button', { name: '+ Add Note', exact: true });

  async login({ email, password }: Credentials) {
    await this.page.getByTestId('login-email').fill(email);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
    await this.addNote.waitFor();
  }

  async createNote(note: NoteDraft) {
    await this.addNote.click();
    await this.page.getByLabel('Category', { exact: true }).selectOption(note.category);
    await this.page.getByLabel('Title', { exact: true }).fill(note.title);
    await this.page.getByLabel('Description', { exact: true }).fill(note.description);
    await this.page.getByTestId('note-submit').click();
  }

  title(text: string) {
    return this.page.getByText(text, { exact: true });
  }
}
