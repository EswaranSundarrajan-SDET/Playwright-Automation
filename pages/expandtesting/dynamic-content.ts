import { BasePage } from '../base-page';

// The checkbox and text input change after a delay. The tests wait for their new states.
export class DynamicControlsPage extends BasePage {
  protected readonly path = '/dynamic-controls';
  readonly checkbox = this.page.getByRole('checkbox');
  readonly text = this.page.getByRole('textbox');

  async toggleCheckbox(action: 'Remove' | 'Add') {
    await this.page.getByRole('button', { name: action, exact: true }).click();
  }

  async toggleInput(action: 'Enable' | 'Disable') {
    await this.page.getByRole('button', { name: action, exact: true }).click();
  }
}

// The greeting starts hidden. Clicking Start makes it visible after a delay.
export class DynamicLoadingPage extends BasePage {
  protected readonly path = '/dynamic-loading/1';
  readonly greeting = this.page.getByRole('heading', { name: 'Hello World!', exact: true });

  async start() {
    await this.page.getByRole('button', { name: 'Start', exact: true }).click();
  }
}

// Find the Chrome row by its cell text because this demo changes the row order.
export class DynamicTablePage extends BasePage {
  protected readonly path = '/dynamic-table';
  private readonly table = this.page.getByRole('table');
  readonly chromeRow = this.table.getByRole('row').filter({
    has: this.page.getByRole('cell', { name: 'Chrome', exact: true }),
  });
  readonly chromeSummary = this.page.getByText(/^Chrome CPU:/);

  // Read the current column headers so the CPU value can be found even when columns move.
  async cpuColumnIndex() {
    const headers = await this.table.getByRole('columnheader').allTextContents();
    return headers.findIndex((header) => header.trim() === 'CPU');
  }
}

// The demo shows two tables. Work with the first one and read the surnames in the displayed order.
export class SortableTablePage extends BasePage {
  protected readonly path = '/tables';
  private readonly table = this.page.locator('#table1');
  readonly lastNames = this.table.locator('tbody tr td:first-child');

  async sortByLastName() {
    await this.table.getByRole('columnheader', { name: 'Last Name', exact: true }).click();
  }
}

// Change the row count and advance to the next set of records.
export class PaginationPage extends BasePage {
  protected readonly path = '/dynamic-pagination-table';
  readonly rows = this.page.getByRole('table').locator('tbody tr');
  private readonly pageSize = this.page.getByRole('combobox');
  // The Next control can be marked up as a button or a link. Match either role by name.
  private readonly next = this.page.getByRole('button', { name: 'Next', exact: true })
    .or(this.page.getByRole('link', { name: 'Next', exact: true }));

  async setPageSize(size: string) {
    await this.pageSize.selectOption(size);
  }

  async goToNextPage() {
    await this.next.click();
  }
}
