import { BasePage } from '../base-page';

/** Adds and removes buttons while the page is open. */
export class ElementsPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/add_remove_elements/';

  /** The button that inserts a new Delete button. */
  readonly addButton = this.page.getByRole('button', { name: 'Add Element' });

  /** All the Delete buttons that currently exist. */
  readonly deleteButtons = this.page.getByRole('button', { name: 'Delete' });
}
