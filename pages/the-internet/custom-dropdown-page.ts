import { BasePage } from '../base-page';

/** Finds the fruit menu built from buttons and options. */
export class CustomDropdownPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/custom_dropdown';

  /** The control that opens the fruit list. */
  readonly menu = this.page.getByRole('combobox');

  /** The banana option in the open list. */
  readonly banana = this.page.getByRole('option', { name: 'Banana' });

  /** The option marked as out of stock. */
  readonly cherry = this.page.getByRole('option', { name: /Cherry/ });

  /** The message showing the selected fruit. */
  readonly result = this.page.locator('#result');
}
