import { BasePage } from '../base-page';

/** Holds the fields on the large form and the table shown after submission. */
export class GuestFormPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/large_form';

  /** The box for the visitor's first name. */
  readonly firstName = this.page.getByLabel('First name');

  /** The box for an email address. */
  readonly email = this.page.locator('input[name=email]');

  /** The number field for the visitor's age. */
  readonly age = this.page.getByRole('spinbutton');

  /** The date field for the visitor's birthday. */
  readonly birthday = this.page.getByLabel('Birthday');

  /** The list that allows one country to be selected. */
  readonly country = this.page.getByLabel('Country');

  /** The list that allows several languages to be selected. */
  readonly languages = this.page.getByRole('listbox');

  /** The box for a description that can span several lines. */
  readonly bio = this.page.getByLabel('About you');

  /** The radio button for contact by phone. */
  readonly phone = this.page.locator('input[type=radio][value=phone]');

  /** The checkbox for accepting the terms. */
  readonly terms = this.page.getByLabel('I accept the terms');

  /** The color picker for the visitor's favorite color. */
  readonly color = this.page.locator('input[type=color]');

  /** The slider for years of experience. */
  readonly experience = this.page.getByRole('slider');

  /** The button that restores the form defaults. */
  readonly reset = this.page.getByRole('button', { name: 'Reset' });

  /** The table containing the values received by the server. */
  readonly submittedData = this.page.locator('#submitted-data');

  /**
   * Set the color field and tell the form that its value changed.
   * @param hex The color written as a hash followed by six digits.
   */
  async setColor(hex: string) {
    // The browser draws its own picker. Set the input value and send the same change events.
    await this.color.evaluate((element, value) => {
      /** The HTML color input that receives the chosen value. */
      const input = element as HTMLInputElement;
      input.value = value;
      input.dispatchEvent(new Event('input', { bubbles: true }));
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }, hex);
  }

  /** Send the current form values to the server. */
  async submit() {
    await this.page.getByRole('button', { name: 'Submit' }).click();
  }
}
