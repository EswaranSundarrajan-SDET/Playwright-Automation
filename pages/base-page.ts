import type { Locator, Page } from '@playwright/test';

// Share the same navigation code across page objects. Each page object supplies its own path.
export abstract class BasePage {
  protected abstract readonly path: string;

  // Store the test's Playwright tab so subclasses can find controls and navigate.
  constructor(protected readonly page: Page) {}

  // Fill several fields in order using Playwright's normal waiting behavior.
  protected async fillFields(fields: ReadonlyArray<readonly [Locator, string]>) {
    for (const [field, value] of fields) {
      await field.fill(value);
    }
  }

  async goto() {
    // Open the path on the configured site and wait for the browser to finish reading the page's HTML.
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    // Report an HTTP failure at the point where the page is opened.
    if (!response?.ok()) {
      throw new Error(`Could not open ${this.path}: HTTP ${response?.status() ?? 'unknown'}`);
    }
  }
}
