import { BasePage } from '../base-page';

/** Opens the example link in a new browser tab. */
export class WindowsPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/windows';

  /** Listen for the new tab before clicking so even a fast popup is captured. */
  async openNewTab() {
    /** The next tab opened by the current page. */
    const nextTab = this.page.waitForEvent('popup');
    await this.page.getByRole('link', { name: 'Click Here' }).click();
    return await nextTab;
  }
}
