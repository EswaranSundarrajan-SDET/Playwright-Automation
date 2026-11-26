export interface InputValues {
  number: string;
  text: string;
  password: string;
  date: string;
}

// These are the public credentials provided by the practice site's login demo.
export const practiceLogin = {
  username: 'practice',
  password: 'SuperSecretPassword!',
  invalidPassword: 'incorrect',
};

// Use the same values to fill the controls and to check what the page displays.
export const practiceInputs: InputValues = {
  number: '42',
  text: 'Playwright',
  password: 'Sample123!',
  date: '2030-06-15',
};
