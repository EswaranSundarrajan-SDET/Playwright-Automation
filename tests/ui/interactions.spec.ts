import { expect, test } from '../../src/fixtures/ui';

test('the range slider responds to keyboard input', async ({ ui }) => {
  await ui.slider.goto();
  await expect(ui.slider.value).toHaveText('0');
  await ui.slider.moveRight();
  await expect(ui.slider.slider).toHaveValue('0.5');
  await expect(ui.slider.value).toHaveText('0.5');
});

test('a key press is shown in the result', async ({ ui }) => {
  await ui.keyboard.goto();
  await ui.keyboard.press('A');
  await expect(ui.keyboard.result).toHaveText('You entered: A');
  await ui.keyboard.press('Enter');
  await expect(ui.keyboard.result).toHaveText('');
});

test('right-clicking the context area opens the demo alert', async ({ ui }) => {
  await ui.contextMenu.goto();
  const dialog = await ui.contextMenu.rightClick();
  expect(dialog.type).toBe('alert');
  expect(dialog.message).toMatch(/context menu/i);
});

test('dragging one column onto the other swaps their labels', async ({ ui }) => {
  await ui.drag.goto();
  await expect(ui.drag.left).toHaveText('A');
  await expect(ui.drag.right).toHaveText('B');
  await ui.drag.swap();
  await expect(ui.drag.left).toHaveText('B');
  await expect(ui.drag.right).toHaveText('A');
});

test('hovering an avatar reveals its profile link', async ({ ui }) => {
  await ui.hover.goto();
  await expect(ui.hover.profile).toBeHidden();
  await ui.hover.showProfile();
  await expect(ui.hover.profile).toBeVisible();
});

test('hovering a button displays a tooltip', async ({ ui }) => {
  await ui.tooltip.goto();
  await ui.tooltip.hover();
  await expect(ui.tooltip.tooltip).toHaveText(/tooltip on top/i);
});

test('accepts alerts, accepts and dismisses confirms, and types into prompts', async ({ ui }) => {
  await ui.dialogs.goto();
  const alert = await ui.dialogs.respond('Js Alert', 'accept');
  expect(alert.type).toBe('alert');
  await expect(ui.dialogs.result).toHaveText(/alert|ok/i);

  const confirm = await ui.dialogs.respond('Js Confirm', 'accept');
  expect(confirm.type).toBe('confirm');
  await expect(ui.dialogs.result).toHaveText(/ok|true|accept/i);

  await ui.dialogs.respond('Js Confirm', 'dismiss');
  await expect(ui.dialogs.result).toHaveText(/cancel|false|dismiss/i);

  const prompt = await ui.dialogs.respond('Js Prompt', 'accept', 'Playwright practice');
  expect(prompt.type).toBe('prompt');
  await expect(ui.dialogs.result).toContainText('Playwright practice');
});
