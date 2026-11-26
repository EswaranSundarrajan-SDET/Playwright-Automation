import { BasePage } from '../base-page';

/** Opens JavaScript alerts, confirmation boxes and text prompts. */
export class AlertsPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/javascript_alerts';

  /** The message left on the page after a dialog closes. */
  readonly result = this.page.locator('#result');

  /**
   * Open a browser dialog and answer it before the page continues.
   * @param kind The dialog button to click.
   * @param action Whether to accept or dismiss the dialog.
   * @param answer The optional text to enter in a prompt.
   */
  async answer(kind: 'Alert' | 'Confirm' | 'Prompt', action: 'accept' | 'dismiss', answer?: string) {
    // Playwright passes the open dialog to this listener as soon as it appears.
    this.page.once('dialog', async (dialog) => {
      if (action === 'accept') {
        await dialog.accept(answer);
      } else {
        await dialog.dismiss();
      }
    });
    await this.page.getByRole('button', { name: `Click for JS ${kind}`, exact: true }).click();
  }
}
