import { BasePage } from '../base-page';

/** Finds controls that disappear, return or become editable after a short wait. */
export class DynamicControlsPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/dynamic_controls';

  /** The checkbox that can be removed and added again. */
  readonly checkbox = this.page.getByRole('checkbox');

  /** The text field that starts disabled. */
  readonly text = this.page.getByRole('textbox');

  /** The button that removes the checkbox. */
  readonly remove = this.page.getByRole('button', { name: 'Remove' });

  /** The button that brings the checkbox back. */
  readonly add = this.page.getByRole('button', { name: 'Add' });

  /** The button that allows typing in the text field. */
  readonly enable = this.page.getByRole('button', { name: 'Enable' });

  /** The button that stops typing in the text field. */
  readonly disable = this.page.getByRole('button', { name: 'Disable' });
}
