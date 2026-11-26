import { BasePage } from '../base-page';

/** Finds a button inside two open shadow roots. */
export class ShadowDomPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/shadowdom_advanced';

  /** The button inside the inner web component. */
  readonly innerButton = this.page.getByRole('button', { name: 'Click me', exact: true });

  /** The text confirming that the button received the click. */
  readonly result = this.page.locator('#nested-result');
}
