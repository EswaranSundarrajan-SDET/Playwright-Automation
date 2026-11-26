import { BasePage } from '../base-page';

/** Chooses a file and submits it with the upload form. */
export class UploadPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/upload';

  /** The file name displayed after the upload finishes. */
  readonly uploadedName = this.page.locator('#uploaded-files');

  /**
   * Upload a small text file created for this test.
   * @param name The file name that should appear on the result page.
   * @param text The plain text to put in the file.
   */
  async uploadText(name: string, text: string) {
    await this.page.locator('#file-upload').setInputFiles({
      name, mimeType: 'text/plain', buffer: Buffer.from(text),
    });
    await this.page.getByRole('button', { name: 'Upload', exact: true }).click();
  }
}
