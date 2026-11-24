import type { Page } from '@playwright/test';

export abstract class PracticePage {
  protected abstract readonly path: string;

  constructor(protected readonly page: Page) {}

  async goto() {
    const response = await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    if (!response?.ok()) {
      throw new Error(`Could not open ${this.path}: HTTP ${response?.status() ?? 'unknown'}`);
    }
  }
}
