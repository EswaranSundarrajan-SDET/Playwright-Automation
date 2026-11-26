import { BasePage } from '../base-page';

/** Scrolls the page to load another paragraph of text. */
export class InfiniteScrollPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/infinite_scroll';

  /** Blocks whose text has finished loading. The page also creates empty blocks while fetching more text. */
  readonly paragraphs = this.page.locator('.jscroll-added:not(:has(.jscroll-loading))');

  /** Scroll to the end of the document so the page can request another block of text. */
  async loadMore() {
    await this.page.keyboard.press('End');
  }
}
