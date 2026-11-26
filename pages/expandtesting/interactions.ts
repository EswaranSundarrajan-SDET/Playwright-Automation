import { captureDialog } from '../../utils/dialog';
import { BasePage } from '../base-page';

// This demo opens a browser alert when the marked area is right-clicked.
export class ContextMenuPage extends BasePage {
  protected readonly path = '/context-menu';
  private readonly hotspot = this.page.locator('#hot-spot');

  async rightClick() {
    return captureDialog(this.page, () => this.hotspot.click({ button: 'right' }));
  }
}

// The page shows both the slider's own value and a separate text value next to it.
export class SliderPage extends BasePage {
  protected readonly path = '/horizontal-slider';
  readonly slider = this.page.getByRole('slider');
  readonly value = this.page.locator('#range');

  // Press the right arrow on the slider to increase it by one step.
  async moveRight() {
    await this.slider.press('ArrowRight');
  }
}

// Send keys to the input and read the result that the page shows below it.
export class KeyboardPage extends BasePage {
  protected readonly path = '/key-presses';
  readonly input = this.page.getByRole('textbox');
  readonly result = this.page.locator('#result');

  async press(key: string) {
    await this.input.press(key);
  }
}

// Drag the left column onto the right column. The test checks how their labels change.
export class DragAndDropPage extends BasePage {
  protected readonly path = '/drag-and-drop';
  readonly left = this.page.locator('#column-a');
  readonly right = this.page.locator('#column-b');

  async swap() {
    await this.left.dragTo(this.right);
  }
}

// Work inside the first user's card so the View profile link comes from the right card.
export class HoverPage extends BasePage {
  protected readonly path = '/hovers';
  private readonly firstCard = this.page.locator('.figure').filter({ hasText: 'name: user1' });
  readonly profile = this.firstCard.getByRole('link', { name: 'View profile' });

  async showProfile() {
    await this.firstCard.getByRole('img', { name: 'User Avatar' }).hover();
  }
}

// Move the pointer onto the button that shows its tooltip above it.
export class TooltipPage extends BasePage {
  protected readonly path = '/tooltips';
  readonly tooltip = this.page.getByRole('tooltip');

  async hover() {
    await this.page.getByRole('button', { name: 'Tooltip on top', exact: true }).hover();
  }
}

// Use the same dialog handler for the alert, confirm box, and prompt buttons.
export class DialogsPage extends BasePage {
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
