import { BasePage } from '../base-page';

/** Finds the last-name column and sorts the example table. */
export class TablesPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/tables';

  /** The names in the order currently shown by the table. */
  readonly lastNames = this.page.locator('#table2 tbody td.last-name');

  /** Click the last-name heading to change the sort order. */
  async sortByLastName() {
    await this.page.locator('#table2').getByRole('columnheader', { name: 'Last Name' }).click();
  }
}
