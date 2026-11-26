import type { Page } from '@playwright/test';

/** Gives each page object the same way to open its screen. */
export abstract class BasePage {
  /** The path of this screen, starting at the website's home page. */
  protected abstract readonly path: string;

  /**
   * Connect this page object to the tab that Playwright opened for the test.
   * @param page The browser tab used by this page object.
   */
  constructor(protected readonly page: Page) {}

  /** Open this screen using the website address in the test settings. */
  async open() {
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
  }
}
