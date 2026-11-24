import { PracticePage } from './practice-page';

export class FramesPage extends PracticePage {
  protected readonly path = '/iframe';
  private readonly subscription = this.page.frameLocator('iframe[src*="iframe-email-subscribe"]');
  readonly email = this.subscription.getByRole('textbox');
  readonly invalidEmail = this.subscription.getByText('Please enter a valid email address.', {
    exact: true,
  });

  async subscribe() {
    await this.subscription.getByRole('button', { name: 'Subscribe' }).click();
  }
}

export class WindowsPage extends PracticePage {
  protected readonly path = '/windows';

  async openNewWindow() {
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 12_000 }),
      this.page.getByRole('link', { name: 'Click Here' }).click(),
    ]);
    return popup;
  }
}

export class ShadowDomPage extends PracticePage {
  protected readonly path = '/shadowdom';
  readonly button = this.page.locator('#shadow-host')
    .getByRole('button', { name: 'This button is inside a Shadow DOM.', exact: true });

  async clickShadowButton() {
    await this.button.click();
  }
}

export class ModalPage extends PracticePage {
  protected readonly path = '/entry-ad';
  readonly dialog = this.page.locator('#exampleModal');

  async close() {
    await this.dialog.getByRole('button', { name: 'Close', exact: true }).click();
  }
}

export class UploadPage extends PracticePage {
  protected readonly path = '/upload';
  readonly uploadInput = this.page.locator('input[type="file"]');
  readonly success = this.page.getByRole('heading', { name: /file uploaded/i });

  async uploadText(name: string, contents: string) {
    await this.uploadInput.setInputFiles({
      name,
      mimeType: 'text/plain',
      buffer: Buffer.from(contents),
    });
    await this.page.getByRole('button', { name: 'Upload', exact: true }).click();
  }

  uploadedName(name: string) {
    return this.page.getByText(name, { exact: false });
  }
}

export class DownloadPage extends PracticePage {
  protected readonly path = '/download';

  async downloadSample() {
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 12_000 }),
      this.page.getByRole('link', { name: 'some-file.txt', exact: true }).click(),
    ]);
    return download;
  }
}
