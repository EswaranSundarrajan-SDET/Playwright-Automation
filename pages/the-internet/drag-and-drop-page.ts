import { BasePage } from '../base-page';

/** Moves a draggable column and reads the new order. */
export class DragAndDropPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/drag_and_drop';

  /** The column on the left before and after the move. */
  readonly left = this.page.locator('#column-a');

  /** The column on the right before and after the move. */
  readonly right = this.page.locator('#column-b');

  /** Drag the left column onto the right column. */
  async swapColumns() {
    await this.left.dragTo(this.right);
  }
}
