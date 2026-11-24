import type { Dialog, Page } from '@playwright/test';
import { PracticePage } from './practice-page';

async function captureDialog(
  page: Page,
  trigger: () => Promise<void>,
  action: 'accept' | 'dismiss' = 'accept',
  answer?: string,
) {
  const respond = async (dialog: Dialog) => {
    const details = { type: dialog.type(), message: dialog.message() };
    if (action === 'dismiss') {
      await dialog.dismiss();
    } else {
      await dialog.accept(answer);
    }
    return details;
  };
  const [details] = await Promise.all([
    page.waitForEvent('dialog', { timeout: 12_000 }).then(respond),
    trigger(),
  ]);
  return details;
}

export class ContextMenuPage extends PracticePage {
  protected readonly path = '/context-menu';
  private readonly hotspot = this.page.locator('#hot-spot');

  async rightClick() {
    return captureDialog(this.page, () => this.hotspot.click({ button: 'right' }));
  }
}

export class SliderPage extends PracticePage {
  protected readonly path = '/horizontal-slider';
  readonly slider = this.page.getByRole('slider');
  readonly value = this.page.locator('#range');

  async moveRight() {
    await this.slider.press('ArrowRight');
  }
}

export class KeyboardPage extends PracticePage {
  protected readonly path = '/key-presses';
  readonly input = this.page.getByRole('textbox');
  readonly result = this.page.locator('#result');

  async press(key: string) {
    await this.input.press(key);
  }
}

export class DragAndDropPage extends PracticePage {
  protected readonly path = '/drag-and-drop';
  readonly left = this.page.locator('#column-a');
  readonly right = this.page.locator('#column-b');

  async swap() {
    await this.left.dragTo(this.right);
  }
}

export class HoverPage extends PracticePage {
  protected readonly path = '/hovers';
  private readonly firstCard = this.page.locator('.figure').filter({ hasText: 'name: user1' });
  readonly profile = this.firstCard.getByRole('link', { name: 'View profile' });

  async showProfile() {
    await this.firstCard.getByRole('img', { name: 'User Avatar' }).hover();
  }
}

export class TooltipPage extends PracticePage {
  protected readonly path = '/tooltips';
  readonly tooltip = this.page.getByRole('tooltip');

  async hover() {
    await this.page.getByRole('button', { name: 'Tooltip on top', exact: true }).hover();
  }
}

export class DialogsPage extends PracticePage {
  protected readonly path = '/js-dialogs';
  readonly result = this.page.locator('#dialog-response, #result').filter({ visible: true });

  async respond(button: string, action: 'accept' | 'dismiss', answer?: string) {
    return captureDialog(
      this.page,
      () => this.page.getByRole('button', { name: button, exact: true }).click(),
      action,
      answer,
    );
  }
}
