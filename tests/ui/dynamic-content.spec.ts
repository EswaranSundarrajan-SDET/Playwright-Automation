import { expect, test } from '../../fixtures/ui';

test('removes and restores an asynchronous checkbox', async ({ ui }) => {
  await ui.dynamic.goto();
  await expect(ui.dynamic.checkbox).toBeVisible();
  await ui.dynamic.toggleCheckbox('Remove');
  // A count of zero confirms the checkbox was removed from the page.
  await expect(ui.dynamic.checkbox).toHaveCount(0);
  await ui.dynamic.toggleCheckbox('Add');
  // The locator finds the replacement checkbox when Playwright tries to check it.
  await ui.dynamic.checkbox.check();
  await expect(ui.dynamic.checkbox).toBeChecked();
});

test('enables and disables an asynchronous text control', async ({ ui }) => {
  await ui.dynamic.goto();
  await expect(ui.dynamic.text).toBeDisabled();
  await ui.dynamic.toggleInput('Enable');
  await expect(ui.dynamic.text).toBeEnabled();
  // Filling the input shows that the newly enabled control accepts text.
  await ui.dynamic.text.fill('Ready to test');
  await expect(ui.dynamic.text).toHaveValue('Ready to test');
  await ui.dynamic.toggleInput('Disable');
  await expect(ui.dynamic.text).toBeDisabled();
});

test('waits for a hidden heading to become visible', async ({ ui }) => {
  await ui.loading.goto();
  await expect(ui.loading.greeting).toBeHidden();
  // The visibility check below waits for the page to reveal the greeting.
  await ui.loading.start();
  await expect(ui.loading.greeting).toBeVisible();
});

test('finds a dynamic table cell by its current column position', async ({ ui }) => {
  await ui.dynamicTable.goto();
  // Find the CPU column by name and compare the Chrome value with the page summary.
  const cpuIndex = await ui.dynamicTable.cpuColumnIndex();
  expect(cpuIndex).toBeGreaterThanOrEqual(0);
  const cpu = (await ui.dynamicTable.chromeRow.getByRole('cell').nth(cpuIndex).innerText()).trim();
  expect(cpu).toMatch(/^\d+(?:\.\d+)?%$/);
  await expect(ui.dynamicTable.chromeSummary).toHaveText(`Chrome CPU: ${cpu}`);
});

test('sorts a table by surname in both directions', async ({ ui }) => {
  // Click the same heading twice to check ascending and descending order.
  await ui.sortable.goto();
  await ui.sortable.sortByLastName();
  await expect(ui.sortable.lastNames).toHaveText(['Bach', 'Conway', 'Doe', 'Smith']);
  await ui.sortable.sortByLastName();
  await expect(ui.sortable.lastNames).toHaveText(['Smith', 'Doe', 'Conway', 'Bach']);
});

test('changes the table page size and navigates to the next page', async ({ ui }) => {
  await ui.pagination.goto();
  await ui.pagination.setPageSize('3');
  await expect(ui.pagination.rows).toHaveCount(3);
  // Remember the rows on page one so the test can tell if Next actually loads new records.
  const firstPage = await ui.pagination.rows.allTextContents();

  await ui.pagination.goToNextPage();
  await expect(ui.pagination.rows).toHaveCount(3);
  // Poll the row text because the page can keep the same row count during the change.
  await expect.poll(() => ui.pagination.rows.allTextContents()).not.toEqual(firstPage);
});
