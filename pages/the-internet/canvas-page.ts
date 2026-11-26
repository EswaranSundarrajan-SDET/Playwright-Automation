import { BasePage } from '../base-page';

/** Finds the drawing area and the log of pointer and keyboard actions. */
export class CanvasPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/canvas';

  /** The surface that accepts clicks and keystrokes. */
  readonly drawing = this.page.locator('#canvas');

  /** The latest action reported by the drawing surface. */
  readonly message = this.page.locator('#canvas-log');
}
