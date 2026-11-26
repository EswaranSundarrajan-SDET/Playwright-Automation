import { BasePage } from '../base-page';

/** Finds the native dialog drawn inside the web page. */
export class ModalPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/dialog';

  /** The button that opens the modal dialog. */
  readonly openButton = this.page.getByRole('button', { name: 'Open modal dialog' });

  /** The modal window while it is open. */
  readonly box = this.page.getByRole('dialog', { name: 'Modal dialog', exact: true });

  /** The name field inside the dialog. */
  readonly name = this.page.locator('#modal-name');

  /** The button that sends the name and closes the dialog. */
  readonly confirm = this.page.getByRole('button', { name: 'Confirm' });

  /** The message written by the page after the dialog closes. */
  readonly result = this.page.locator('#result');
}
