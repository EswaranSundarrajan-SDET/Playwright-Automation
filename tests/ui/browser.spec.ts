import { expect, test } from '../../fixtures/ui';
import { readFile } from 'node:fs/promises';

/** Use the alerts page to check the result of each kind of JavaScript dialog. */
test('a visitor can accept an alert, cancel a confirmation and answer a prompt', async ({ alerts }) => {
  await alerts.open();
  await alerts.answer('Alert', 'accept');
  await expect(alerts.result).toHaveText('You successfully clicked an alert');
  await alerts.answer('Confirm', 'dismiss');
  await expect(alerts.result).toHaveText('You clicked: Cancel');
  await alerts.answer('Confirm', 'accept');
  await expect(alerts.result).toHaveText('You clicked: Ok');
  await alerts.answer('Prompt', 'accept', 'Hello');
  await expect(alerts.result).toHaveText('You entered: Hello');
});

/** Use the modal page to check the dialog and its result. */
test('a native page dialog accepts a name and closes', async ({ modal }) => {
  await modal.open();
  await modal.openButton.click();
  await expect(modal.box).toBeVisible();
  await modal.name.fill('Sam');
  await modal.confirm.click();
  await expect(modal.box).toBeHidden();
  await expect(modal.result).toContainText('confirm (name: Sam)');
});

/** Use the frames page to read text through both frame levels. */
test('the middle frame contains its own document', async ({ frames }) => {
  await frames.open();
  await expect(frames.middle).toHaveText('MIDDLE');
});

/** Use the editor page to replace text inside its frame. */
test('a rich text editor accepts new content', async ({ editor }) => {
  await editor.open();
  await editor.body.fill('Testing the editor');
  await expect(editor.body).toHaveText('Testing the editor');
});

/** Use the windows page to check the address and heading of the new tab. */
test('a link opens the expected page in another tab', async ({ windows }) => {
  await windows.open();
  /** The tab opened by clicking the link on the windows page. */
  const tab = await windows.openNewTab();
  await expect(tab).toHaveURL(/\/windows\/new$/);
  await expect(tab.getByRole('heading', { name: 'New Window' })).toBeVisible();
});

/** Use the upload page to send a harmless sample file and check its name. */
test('a small text file can be uploaded', async ({ files }) => {
  await files.open();
  await files.uploadText('playwright-framework-example.txt', 'Sample file for the upload test.');
  await expect(files.uploadedName).toHaveText('playwright-framework-example.txt');
});

/** Use the download page to save the CSV and read the file Playwright received. */
test('a CSV download has the expected file name and contents', async ({ downloads }) => {
  await downloads.open();
  /** The completed or in-progress download started by the page. */
  const download = await downloads.downloadCsv();
  expect(download.suggestedFilename()).toBe('report.csv');
  /** The temporary file where Playwright finished saving the download. */
  const path = await download.path();
  if (!path) throw new Error('The browser did not save the CSV file.');
  expect(await readFile(path, 'utf8')).toBe('name,count\napple,3\nbanana,5\n');
});

/** Use the shadow DOM page to reach the inner component's button. */
test('a button inside nested shadow roots can be clicked', async ({ shadow }) => {
  await shadow.open();
  await shadow.innerButton.click();
  await expect(shadow.result).toContainText('clicked the button in the inner shadow root');
});
