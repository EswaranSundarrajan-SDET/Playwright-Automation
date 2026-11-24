import { PracticePage } from './practice-page';

export class DynamicControlsPage extends PracticePage {
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

export class DynamicLoadingPage extends PracticePage {
  protected readonly path = '/dynamic-loading/1';
  readonly greeting = this.page.getByRole('heading', { name: 'Hello World!', exact: true });

  async start() {
    await this.page.getByRole('button', { name: 'Start', exact: true }).click();
  }
}

export class DynamicTablePage extends PracticePage {
  protected readonly path = '/dynamic-table';
  private readonly table = this.page.getByRole('table');
  readonly chromeRow = this.table.getByRole('row').filter({
    has: this.page.getByRole('cell', { name: 'Chrome', exact: true }),
  });
  readonly chromeSummary = this.page.getByText(/^Chrome CPU:/);

  async cpuColumnIndex() {
    const headers = await this.table.getByRole('columnheader').allTextContents();
    return headers.findIndex((header) => header.trim() === 'CPU');
  }
}

export class SortableTablePage extends PracticePage {
  protected readonly path = '/tables';
  private readonly table = this.page.locator('#table1');
  readonly lastNames = this.table.locator('tbody tr td:first-child');

  async sortByLastName() {
    await this.table.getByRole('columnheader', { name: 'Last Name', exact: true }).click();
  }
}

export class PaginationPage extends PracticePage {
  protected readonly path = '/dynamic-pagination-table';
  readonly rows = this.page.getByRole('table').locator('tbody tr');
  private readonly pageSize = this.page.getByRole('combobox');
  private readonly next = this.page.getByRole('button', { name: 'Next', exact: true })
    .or(this.page.getByRole('link', { name: 'Next', exact: true }));

  async setPageSize(size: string) {
    await this.pageSize.selectOption(size);
  }

  async goToNextPage() {
    await this.next.click();
  }
}
