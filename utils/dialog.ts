import type { Dialog, Page } from '@playwright/test';

// Listen for a browser dialog, answer it, and return the details the test needs to check.
export async function captureDialog(
  page: Page,
  trigger: () => Promise<void>,
  action: 'accept' | 'dismiss' = 'accept',
  answer?: string,
) {
  const respond = async (dialog: Dialog) => {
    const details = { type: dialog.type(), message: dialog.message() };
    // Dismiss is the Cancel action. Accept is the OK action and can also send text to a prompt.
    if (action === 'dismiss') {
      await dialog.dismiss();
    } else {
      await dialog.accept(answer);
    }
    return details;
  };
  // Start listening before the action so a dialog that opens immediately is still captured.
  const [details] = await Promise.all([
    page.waitForEvent('dialog', { timeout: 12_000 }).then(respond),
    trigger(),
  ]);
  return details;
}
