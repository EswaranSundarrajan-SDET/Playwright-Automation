import { BasePage } from '../base-page';

/** Finds the native time field and the appointment calendar. */
export class DatePickersPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/date_pickers?month=2030-05';

  /** The field that accepts a time of day. */
  readonly time = this.page.getByLabel('Time', { exact: true });

  /** The field that shows the day chosen in the calendar. */
  readonly appointment = this.page.getByLabel('Appointment');

  /**
   * Open the calendar and pick a day from the visible month.
   * @param day The day number shown on the calendar button.
   */
  async pickDay(day: number) {
    await this.page.getByRole('button', { name: 'Open calendar' }).click();
    await this.page.getByRole('button', { name: String(day), exact: true }).click();
  }
}
