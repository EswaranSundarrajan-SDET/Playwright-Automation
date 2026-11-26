// These types describe the data sent to and returned by the Notes API.
export interface Credentials {
  email: string;
  password: string;
}

export interface Account extends Credentials {
  name: string;
}

export type Category = 'Home' | 'Work' | 'Personal';

// A draft contains the fields entered by the user. The server adds the ID and completion state.
export interface NoteDraft {
  title: string;
  description: string;
  category: Category;
}

export interface Note extends NoteDraft {
  id: string;
  completed: boolean;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
}

export interface Session extends Profile {
  token: string;
}
