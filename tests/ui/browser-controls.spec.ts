import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { expect, test } from '../../src/fixtures/ui';

test('interacts with an email field inside an iframe', async ({ ui }) => {
  await ui.frames.goto();
  await ui.frames.email.fill('not-an-email');
  await expect(ui.frames.email).toHaveValue('not-an-email');
  await ui.frames.subscribe();
  await expect(ui.frames.invalidEmail).toBeVisible();
});

test('opens a new window and verifies its content', async ({ ui }) => {
  await ui.windows.goto();
  const popup = await ui.windows.openNewWindow();
  try {
    await expect(popup).toHaveURL(/\/windows\/new\/?$/);
    await expect(popup.getByRole('heading', { name: /example of a new window/i })).toBeVisible();
  } finally {
    await popup.close();
  }
});

test('clicks a button in an open shadow root', async ({ ui }) => {
  await ui.shadow.goto();
  await expect(ui.shadow.button).toBeVisible();
  const dialog = await ui.shadow.clickShadowButton();
  expect(dialog.type).toBe('alert');
  expect(dialog.message).toMatch(/\S/);
});

test('uploads a generated text file', async ({ ui }) => {
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

  const path = testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(path);
  expect(await readFile(path, 'utf8')).toContain('Welcome to the Practice Web App');
});
