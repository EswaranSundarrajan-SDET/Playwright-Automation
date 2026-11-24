import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from '../../src/fixtures/ui';

test('interacts with an email field inside an iframe', async ({ ui }) => {
  await ui.frames.goto();
  // Enter invalid text into the iframe and check that the validation message appears inside it.
  await ui.frames.email.fill('not-an-email');
  await expect(ui.frames.email).toHaveValue('not-an-email');
  await ui.frames.subscribe();
  await expect(ui.frames.invalidEmail).toBeVisible();
});

test('opens a new window and verifies its content', async ({ ui }) => {
  await ui.windows.goto();
  const popup = await ui.windows.openNewWindow();
  try {
    // Check the URL and heading on the new tab.
    await expect(popup).toHaveURL(/\/windows\/new\/?$/);
    await expect(popup.getByRole('heading', { name: /example of a new window/i })).toBeVisible();
  } finally {
    // Close the extra tab even if one of its checks fails.
    await popup.close();
  }
});

test('clicks a button in an open shadow root', async ({ ui }) => {
  await ui.shadow.goto();
  await expect(ui.shadow.button).toBeVisible();
  // Check the element's root to verify the locator actually found the button inside the shadow tree.
  expect(await ui.shadow.button.evaluate((element) => element.getRootNode() instanceof ShadowRoot))
    .toBe(true);
  await ui.shadow.clickShadowButton();
});

test('closes an HTML modal without leaving the page', async ({ page, ui }) => {
  await ui.modal.goto();
  await expect(ui.modal.dialog).toBeVisible();
  await ui.modal.close();
  await expect(ui.modal.dialog).toBeHidden();
  // The URL check confirms that closing the modal kept the original page open.
  await expect(page).toHaveURL(/\/entry-ad\/?$/);
});

test('uploads a generated text file', async ({ ui }) => {
  // Use a unique file name so parallel test uploads cannot be mistaken for one another.
  const name = `pw-${randomUUID()}.txt`;
  await ui.upload.goto();
  await ui.upload.uploadText(name, 'Playwright upload practice.\n');
  await expect(ui.upload.success).toBeVisible();
  await expect(ui.upload.uploadedName(name)).toBeVisible();
});

test('downloads the built-in sample and verifies its contents', async ({ ui }, testInfo) => {
  await ui.download.goto();
  const download = await ui.download.downloadSample();
  expect(download.suggestedFilename()).toBe('some-file.txt');

  // Save the file in this test's output folder and read it back to check its contents.
  const path = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(path);
  expect(await readFile(path, 'utf8')).toContain('Welcome to the Practice Web App');
});
