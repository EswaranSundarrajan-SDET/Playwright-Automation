import { PracticePage } from './practice-page';

export class LoginPage extends PracticePage {
  protected readonly path = '/login';
  readonly username = this.page.getByLabel('Username', { exact: true });
  readonly password = this.page.getByLabel('Password', { exact: true });
  readonly logoutLink = this.page.getByRole('link', { name: /logout/i });
  readonly error = this.page.getByText('Invalid password.', { exact: false });

  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}

type InputValues = { number: string; text: string; password: string; date: string };

export class InputsPage extends PracticePage {
  protected readonly path = '/inputs';
  readonly number = this.page.getByLabel('Input: Number');
  readonly text = this.page.getByLabel('Input: Text');
  readonly password = this.page.getByLabel('Input: Password');
  readonly date = this.page.getByLabel('Input: Date');

  async enter(values: InputValues) {
    await this.number.fill(values.number);
    await this.text.fill(values.text);
    await this.password.fill(values.password);
    await this.date.fill(values.date);
  }

  output(field: keyof InputValues) {
    return this.page.locator(`#output-${field}`);
  }

  async display() {
    await this.page.getByRole('button', { name: 'Display Inputs' }).click();
  }

  async clear() {
    await this.page.getByRole('button', { name: 'Clear Inputs' }).click();
  }
}

export class FormValidationPage extends PracticePage {
  protected readonly path = '/form-validation';
  readonly contactName = this.page.getByLabel('Contact Name', { exact: true });
  readonly nameError = this.page.getByText('Please enter your Contact name.', { exact: true });
  readonly phoneError = this.page.getByText('Please provide your Contact number.', { exact: true });
  readonly dateError = this.page.getByText('Please provide valid Date.', { exact: true });
  readonly paymentError = this.page.getByText('Please select the Paymeny Method.', { exact: true });

  async submit() {
    await this.page.getByRole('button', { name: 'Register', exact: true }).click();
  }
}

export class CheckboxesPage extends PracticePage {
  protected readonly path = '/checkboxes';
  readonly first = this.page.getByRole('checkbox', { name: 'Checkbox 1', exact: true });
  readonly second = this.page.getByRole('checkbox', { name: 'Checkbox 2', exact: true });
}

export class RadioButtonsPage extends PracticePage {
  protected readonly path = '/radio-buttons';
  readonly blue = this.page.getByRole('radio', { name: 'Blue', exact: true });
  readonly red = this.page.getByRole('radio', { name: 'Red', exact: true });
  readonly green = this.page.locator('input#green');
  readonly tennis = this.page.getByRole('radio', { name: 'Tennis', exact: true });
}

export class DropdownPage extends PracticePage {
  protected readonly path = '/dropdown';
  readonly simple = this.page.locator('#dropdown');
  readonly pageSize = this.page.getByLabel('Elements per Page:');
  readonly country = this.page.locator('#country');

  async selectOptions() {
    await this.simple.selectOption({ label: 'Option 2' });
    await this.pageSize.selectOption('20');
    await this.country.selectOption({ label: 'India' });
  }

  selectedCountry() {
    return this.country.locator('option:checked');
  }
}

export class AutocompletePage extends PracticePage {
  protected readonly path = '/autocomplete';
  readonly country = this.page.getByPlaceholder('Country name');

  async chooseCountry(prefix: string, suggestion: string) {
    await this.country.fill(prefix);
    await this.page.getByText(suggestion, { exact: true }).click();
  }
}
