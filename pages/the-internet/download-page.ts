import { BasePage } from '../base-page';

/** Downloads the sample CSV made by the page. */
export class DownloadPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/download_modern';

  /** Start the CSV download and return Playwright's handle for the file. */
  async downloadCsv() {
    /** The next file download started in this tab. */
    const nextFile = this.page.waitForEvent('download');
    await this.page.getByRole('button', { name: /Download a CSV/ }).click();
    return await nextFile;
  }
}
