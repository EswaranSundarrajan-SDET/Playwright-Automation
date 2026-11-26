import { BasePage } from '../base-page';

/** Finds interactive shapes in the SVG chart. */
export class ChartPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/svg';

  /** The chart bar showing how many apples were sold. */
  readonly apples = this.page.locator('#bar-apples');

  /** The circle that changes color when clicked. */
  readonly circle = this.page.locator('#toggle-circle');

  /** The message describing the last shape that was clicked. */
  readonly result = this.page.locator('#result');
}
