import { BasePage } from '../base-page';

/** Opens the example's context menu with the right mouse button. */
export class ContextMenuPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/context_menu';

  /** Right-click the target, close its alert and return the alert text. */
  async rightClick() {
    /** The alert text is read before the dialog closes. */
    const message = this.page.waitForEvent('dialog').then(async (dialog) => {
      /** The message shown by the browser dialog. */
      const text = dialog.message();
      await dialog.accept();
      return text;
    });
    await this.page.locator('#hot-spot').click({ button: 'right' });
    return await message;
  }
}
