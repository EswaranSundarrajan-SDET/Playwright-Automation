import { BasePage } from '../base-page';

/** Scrolls the page to load another paragraph of text. */
export class InfiniteScrollPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/infinite_scroll';

  /** The blocks of content added by the scrolling example. */
  readonly paragraphs = this.page.locator('.jscroll-added');

  /** Move the last loaded block into view and scroll down to request more content. */
  async loadMore() {
    await this.paragraphs.last().scrollIntoViewIfNeeded();
    await this.page.mouse.wheel(0, 2500);
  }
}
