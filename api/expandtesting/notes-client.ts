import type { Account, Credentials, NoteDraft } from '../../test-data/expandtesting/notes.types';
import type { ApiClient } from '../api-client';

// Keep the Notes API paths and request details in one place. Tests receive the response and check it
// themselves.
export class NotesClient {
  constructor(private readonly api: ApiClient) {}

  // The Notes API expects the login token in the x-auth-token header.
  withToken(token: string) {
    return new NotesClient(this.api.withHeaders({ 'x-auth-token': token }));
  }

  // Check whether the Notes service is available. This endpoint is public.
  health() {
    return this.api.request('GET', 'health-check');
  }

  // Send the name, email, and password for a new demo user.
  register(account: Account) {
    return this.api.request('POST', 'users/register', { data: account });
  }

  // Send just the credentials to get a token from the login response.
  login({ email, password }: Credentials) {
    return this.api.request('POST', 'users/login', { data: { email, password } });
  }

  // Read the profile for the user identified by the current token.
  profile() {
    return this.api.request('GET', 'users/profile');
  }

  // Remove the temporary account during fixture cleanup.
  deleteAccount() {
    return this.api.request('DELETE', 'users/delete-account');
  }

  // Read the notes owned by the signed-in user.
  list() {
    return this.api.request('GET', 'notes');
  }

  // Allow any category string here so a test can send an invalid value and check the server's response.
  create(note: Omit<NoteDraft, 'category'> & { category: string }) {
    return this.api.request('POST', 'notes', { data: note });
  }

  // Put the note ID in the URL to read one record. Encoding keeps the ID in a single part of the path.
  get(id: string) {
    return this.api.request('GET', `notes/${encodeURIComponent(id)}`);
  }

  // PUT sends the full set of editable fields for the existing note.
  replace(id: string, note: NoteDraft & { completed: boolean }) {
    return this.api.request('PUT', `notes/${encodeURIComponent(id)}`, {
      data: note,
    });
  }

  // PATCH sends just the completion flag for an existing note.
  setCompleted(id: string, completed: boolean) {
    return this.api.request('PATCH', `notes/${encodeURIComponent(id)}`, {
      data: { completed },
    });
  }

  // Remove the note identified by the ID in the URL.
  delete(id: string) {
    return this.api.request('DELETE', `notes/${encodeURIComponent(id)}`);
  }
}
