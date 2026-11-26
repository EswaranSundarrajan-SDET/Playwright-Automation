import { BasePage } from '../base-page';

/** Finds the fruit search box and its delayed suggestions. */
export class AutocompletePage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/autocomplete';

  /** The box where the visitor starts typing a fruit name. */
  readonly query = this.page.getByRole('combobox');

  /** The message showing the fruit chosen from the suggestions. */
  readonly selected = this.page.locator('#selected');

  /**
   * Pick a fruit after the server sends the matching suggestions.
   * @param name The fruit name shown in the list.
   */
  async choose(name: string) {
    await this.page.getByRole('option', { name, exact: true }).click();
  }
}
