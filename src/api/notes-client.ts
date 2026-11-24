import type { APIRequestContext } from '@playwright/test';

// These types describe the data sent to and returned by the Notes API.
export type Credentials = { email: string; password: string };
export type Account = Credentials & { name: string };
export type Category = 'Home' | 'Work' | 'Personal';
// A draft contains the fields entered by the user. The server adds the ID and completion state.
export type NoteDraft = { title: string; description: string; category: Category };
export type Note = NoteDraft & { id: string; completed: boolean };
export type Profile = { id: string; name: string; email: string };
export type Session = Profile & { token: string };

// Keep the Notes API paths and request details in one place. Tests receive the response and check it
// themselves.
export class NotesClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  // Reuse the request context with a new client that carries the login token.
  withToken(token: string) {
    return new NotesClient(this.request, token);
  }

  // The demo expects the token in x-auth-token. An anonymous client sends no token.
  private get headers() {
    return this.token ? { 'x-auth-token': this.token } : undefined;
  }

  // Check whether the Notes service is available. This endpoint is public.
  health() {
    return this.request.get('health-check');
  }

  // Send the name, email, and password for a new demo user.
  register(account: Account) {
    return this.request.post('users/register', { data: account });
  }

  // Send just the credentials to get a token from the login response.
  login({ email, password }: Credentials) {
    return this.request.post('users/login', { data: { email, password } });
  }

  // Read the profile for the user identified by the current token.
  profile() {
    return this.request.get('users/profile', { headers: this.headers });
  }

  // Remove the temporary account during fixture cleanup.
  deleteAccount() {
    return this.request.delete('users/delete-account', { headers: this.headers });
  }

  // Read the notes owned by the signed-in user.
  list() {
    return this.request.get('notes', { headers: this.headers });
  }

  // Allow any category string here so a test can send an invalid value and check the server's response.
  create(note: Omit<NoteDraft, 'category'> & { category: string }) {
    return this.request.post('notes', { data: note, headers: this.headers });
  }

  // Put the note ID in the URL to read one record. Encoding keeps the ID in a single part of the path.
  get(id: string) {
    return this.request.get(`notes/${encodeURIComponent(id)}`, { headers: this.headers });
  }

  // PUT sends the full set of editable fields for the existing note.
  replace(id: string, note: NoteDraft & { completed: boolean }) {
    return this.request.put(`notes/${encodeURIComponent(id)}`, {
      data: note,
      headers: this.headers,
    });
  }

  // PATCH sends just the completion flag for an existing note.
  setCompleted(id: string, completed: boolean) {
    return this.request.patch(`notes/${encodeURIComponent(id)}`, {
      data: { completed },
      headers: this.headers,
    });
  }

  // Remove the note identified by the ID in the URL.
  delete(id: string) {
    return this.request.delete(`notes/${encodeURIComponent(id)}`, { headers: this.headers });
  }
}
