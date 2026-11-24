import type { Page } from '@playwright/test';

// Share the same navigation code across page objects. Each page object supplies its own path.
export abstract class PracticePage {
  protected abstract readonly path: string;

  // Store the test's Playwright tab so subclasses can find controls and navigate.
  constructor(protected readonly page: Page) {}

  async goto() {
    // Open the path on the configured site and wait for the browser to finish reading the page's HTML.
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    // Report an HTTP failure here to show whether navigation reached the demo page.
    if (!response?.ok()) {
      throw new Error(`Could not open ${this.path}: HTTP ${response?.status() ?? 'unknown'}`);
    }
  }
}
