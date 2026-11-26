import type { InputValues } from '../test-data/forms.data';
import { PracticePage } from './practice-page';

// The practice login page has fields for both successful and unsuccessful sign-in tests.
export class LoginPage extends PracticePage {
  protected readonly path = '/login';
  readonly username = this.page.getByLabel('Username', { exact: true });
  readonly password = this.page.getByLabel('Password', { exact: true });
  readonly logoutLink = this.page.getByRole('link', { name: /logout/i });
  readonly error = this.page.getByText('Invalid password.', { exact: false });

  // Fill both fields and submit the form. The test checks the outcome.
  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.page.getByRole('button', { name: 'Login', exact: true }).click();
  }

  async logout() {
    await this.logoutLink.click();
  }
}

// The input page has number, text, password, and date fields with a separate area for displayed values.
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
    // Playwright fills a native date field with a string in YYYY-MM-DD format.
    await this.date.fill(values.date);
  }

  // The page uses the field name as part of each output element's ID.
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

// Expose the warning beside each required field so the test can check what the user sees.
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

// Use each checkbox's visible name to find it. The tests can check and uncheck the boxes separately.
export class CheckboxesPage extends PracticePage {
  protected readonly path = '/checkboxes';
  readonly first = this.page.getByRole('checkbox', { name: 'Checkbox 1', exact: true });
  readonly second = this.page.getByRole('checkbox', { name: 'Checkbox 2', exact: true });
}

// The demo has separate color and sport groups.
export class RadioButtonsPage extends PracticePage {
  protected readonly path = '/radio-buttons';
  readonly blue = this.page.getByRole('radio', { name: 'Blue', exact: true });
  readonly red = this.page.getByRole('radio', { name: 'Red', exact: true });
  // The disabled Green input has no associated label, so find it by its ID.
  readonly green = this.page.locator('input#green');
  readonly tennis = this.page.getByRole('radio', { name: 'Tennis', exact: true });
}

// These controls are HTML select elements, so Playwright can choose an option directly.
export class DropdownPage extends PracticePage {
  protected readonly path = '/dropdown';
  readonly simple = this.page.locator('#dropdown');
  readonly pageSize = this.page.getByLabel('Elements per Page:');
  readonly country = this.page.locator('#country');

  // Select by the label the user sees or by the value stored in the option.
  async selectOptions() {
    await this.simple.selectOption({ label: 'Option 2' });
    await this.pageSize.selectOption('20');
    await this.country.selectOption({ label: 'India' });
  }

  // Find the selected option so the test can check its displayed country name.
  selectedCountry() {
    return this.country.locator('option:checked');
  }
}

// Type part of a country name, then click the matching suggestion when it appears.
export class AutocompletePage extends PracticePage {
  protected readonly path = '/autocomplete';
  readonly country = this.page.getByPlaceholder('Country name');

  async chooseCountry(prefix: string, suggestion: string) {
    await this.country.fill(prefix);
    await this.page.getByText(suggestion, { exact: true }).click();
  }
}
