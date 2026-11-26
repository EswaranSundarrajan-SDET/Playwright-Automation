import { BasePage } from '../base-page';

/** Finds the first visitor photo and its hidden profile link. */
export class HoverPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/hovers';

  /** The first profile photo in the gallery. */
  readonly photo = this.page.getByAltText('User Avatar').first();

  /** The link revealed when the pointer is over the first photo. */
  readonly profile = this.page.locator('.figure').first().getByRole('link');
}
