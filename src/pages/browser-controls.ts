import { PracticePage } from './practice-page';

// An iframe is a page inside another page. Find the subscription input and button inside the frame.
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

// The link opens a separate tab or window, which Playwright gives back as another Page object.
export class WindowsPage extends PracticePage {
  protected readonly path = '/windows';

  async openNewWindow() {
    // Start waiting before clicking the link so an immediate popup is captured.
    const [popup] = await Promise.all([
      this.page.waitForEvent('popup', { timeout: 12_000 }),
      this.page.getByRole('link', { name: 'Click Here' }).click(),
    ]);
    return popup;
  }
}

// The button is inside an open shadow root. Playwright can find it by role from the host element.
export class ShadowDomPage extends PracticePage {
  protected readonly path = '/shadowdom';
  readonly button = this.page.locator('#shadow-host')
    .getByRole('button', { name: 'This button is inside a Shadow DOM.', exact: true });

  async clickShadowButton() {
    await this.button.click();
  }
}

// The HTML modal is part of the current page. Use the Close button within that modal.
export class ModalPage extends PracticePage {
  protected readonly path = '/entry-ad';
  readonly dialog = this.page.locator('#exampleModal');

  async close() {
    await this.dialog.getByRole('button', { name: 'Close', exact: true }).click();
  }
}

// Use a generated text file so every test can upload a file with its own name.
export class UploadPage extends PracticePage {
  protected readonly path = '/upload';
  readonly uploadInput = this.page.locator('input[type="file"]');
  readonly success = this.page.getByRole('heading', { name: /file uploaded/i });

  async uploadText(name: string, contents: string) {
    // Give the file input a name and contents directly. This avoids the operating system's file picker.
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

// Use the sample file that ships with the demo. Its name and contents are stable.
export class DownloadPage extends PracticePage {
  protected readonly path = '/download';

  async downloadSample() {
    // Start listening for the download before clicking its link.
    const [download] = await Promise.all([
      this.page.waitForEvent('download', { timeout: 12_000 }),
      this.page.getByRole('link', { name: 'some-file.txt', exact: true }).click(),
    ]);
    return download;
  }
}
