import type { APIRequestContext } from '@playwright/test';

export type Credentials = { email: string; password: string };
export type Account = Credentials & { name: string };
export type Category = 'Home' | 'Work' | 'Personal';
export type NoteDraft = { title: string; description: string; category: Category };
export type Note = NoteDraft & { id: string; completed: boolean };
export type Profile = { id: string; name: string; email: string };
export type Session = Profile & { token: string };

export class NotesClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly token?: string,
  ) {}

  withToken(token: string) {
    return new NotesClient(this.request, token);
  }

  private get headers() {
    return this.token ? { 'x-auth-token': this.token } : undefined;
  }

  health() {
    return this.request.get('health-check');
  }

  register(account: Account) {
    return this.request.post('users/register', { data: account });
  }

  login({ email, password }: Credentials) {
    return this.request.post('users/login', { data: { email, password } });
  }

  profile() {
    return this.request.get('users/profile', { headers: this.headers });
  }

  deleteAccount() {
    return this.request.delete('users/delete-account', { headers: this.headers });
  }

  list() {
    return this.request.get('notes', { headers: this.headers });
  }

  create(note: Omit<NoteDraft, 'category'> & { category: string }) {
    return this.request.post('notes', { data: note, headers: this.headers });
  }

  get(id: string) {
    return this.request.get(`notes/${encodeURIComponent(id)}`, { headers: this.headers });
  }

  replace(id: string, note: NoteDraft & { completed: boolean }) {
    return this.request.put(`notes/${encodeURIComponent(id)}`, {
      data: note,
      headers: this.headers,
    });
  }

  setCompleted(id: string, completed: boolean) {
    return this.request.patch(`notes/${encodeURIComponent(id)}`, {
      data: { completed },
      headers: this.headers,
    });
  }

  delete(id: string) {
    return this.request.delete(`notes/${encodeURIComponent(id)}`, { headers: this.headers });
  }
}
