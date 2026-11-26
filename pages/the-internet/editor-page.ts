import { BasePage } from '../base-page';

/** Finds the rich text field inside the editor's frame. */
export class EditorPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/iframe';

  /** The editable document where the visitor types formatted text. */
  readonly body = this.page.frameLocator('iframe').locator('body');
}
