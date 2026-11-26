import { BasePage } from '../base-page';

/** Finds fields that can be locked, edited or disabled. */
export class ReadOnlyPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/readonly';

  /** The checkbox that locks the editable field. */
  readonly lock = this.page.getByRole('checkbox');

  /** The field whose editing state can change. */
  readonly text = this.page.locator('#textfield');

  /** The field that stays disabled. */
  readonly disabled = this.page.locator('#disabled');
}
