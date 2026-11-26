import { BasePage } from '../base-page';

/** Reads content from a frame nested inside another frame. */
export class NestedFramesPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/nested_frames';

  /** The body of the middle frame inside the upper row. */
  readonly middle = this.page.frameLocator('frame[name=frame-top]').frameLocator('frame[name=frame-middle]').locator('body');
}
