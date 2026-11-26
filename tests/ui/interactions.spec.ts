import { expect, test } from '../../fixtures/ui';

/** Use the elements page to check that each click changes the number of buttons. */
test('buttons can be added to the page and removed', async ({ elements }) => {
  await elements.open();
  await elements.addButton.click();
  await elements.addButton.click();
  await expect(elements.deleteButtons).toHaveCount(2);
  await elements.deleteButtons.first().click();
  await expect(elements.deleteButtons).toHaveCount(1);
});

/** Use the dynamic controls page to check both states of the checkbox. */
test('a checkbox can disappear and return', async ({ dynamic }) => {
  await dynamic.open();
  await dynamic.remove.click();
  await expect(dynamic.checkbox).toHaveCount(0);
  await dynamic.add.click();
  await dynamic.checkbox.check();
  await expect(dynamic.checkbox).toBeChecked();
});

/** Use the dynamic controls page to wait for the text field to allow typing. */
test('a delayed field can be enabled and disabled', async ({ dynamic }) => {
  await dynamic.open();
  await expect(dynamic.text).toBeDisabled();
  await dynamic.enable.click();
  await dynamic.text.fill('Ready');
  await expect(dynamic.text).toHaveValue('Ready');
  await dynamic.disable.click();
  await expect(dynamic.text).toBeDisabled();
});

/** Use the drag-and-drop page to check both columns after the move. */
test('dragging a column swaps the labels', async ({ drag }) => {
  await drag.open();
  await drag.swapColumns();
  await expect(drag.left).toHaveText('B');
  await expect(drag.right).toHaveText('A');
});

/** Use the hover page to check when the first profile link is visible. */
test('hovering reveals a profile link', async ({ hover }) => {
  await hover.open();
  await expect(hover.profile).toBeHidden();
  await hover.photo.hover();
  await expect(hover.profile).toBeVisible();
  await expect(hover.profile).toHaveAttribute('href', '/users/1');
});

/** Use the context menu page to check the message sent by a right click. */
test('right-clicking opens the context menu alert', async ({ contextMenu }) => {
  await contextMenu.open();
  expect(await contextMenu.rightClick()).toBe('You selected a context menu');
});

/** Use the tables page to check the complete order after each click. */
test('the table sorts names in both directions', async ({ tables }) => {
  await tables.open();
  await tables.sortByLastName();
  await expect(tables.lastNames).toHaveText(['Bach', 'Conway', 'Doe', 'Smith']);
  await tables.sortByLastName();
  await expect(tables.lastNames).toHaveText(['Smith', 'Doe', 'Conway', 'Bach']);
});

/** Use the canvas page to draw a dot and submit text with the keyboard. */
test('the canvas accepts a pointer click and typed characters', async ({ canvas }) => {
  await canvas.open();
  await canvas.drawing.click({ position: { x: 40, y: 30 } });
  await expect(canvas.message).toContainText('Clicked at');
  await canvas.drawing.pressSequentially('Hello');
  await canvas.drawing.press('Enter');
  await expect(canvas.message).toHaveText('Submitted: Hello');
});

/** Use the SVG chart to select a bar and toggle the circle twice. */
test('a chart bar and a double-clicked circle show their results', async ({ chart }) => {
  await chart.open();
  await chart.apples.click();
  await expect(chart.result).toHaveText('Selected Apples: 120');
  await chart.circle.dblclick();
  await expect(chart.result).toHaveText('Circle is green');
});

/** Use the scrolling page to check that more content arrives as the visitor moves down. */
test('scrolling loads another block of text', async ({ scroll }) => {
  await scroll.open();
  await expect(scroll.paragraphs.first()).toBeVisible();
  /** How many blocks were on the page before scrolling. */
  const before = await scroll.paragraphs.count();
  await scroll.loadMore();
  // Read the block count again until the website has loaded the next block.
  await expect.poll(() => scroll.paragraphs.count()).toBeGreaterThan(before);
});
