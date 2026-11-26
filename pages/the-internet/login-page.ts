import { BasePage } from '../base-page';

/** Signs a visitor in and out of the secure area. */
export class LoginPage extends BasePage {
  /** The address of this example on The Internet. */
  protected readonly path = '/login';

  /** The banner that explains whether signing in or out worked. */
  readonly message = this.page.locator('#flash');

  /** The link that ends the current session. */
  readonly logout = this.page.getByRole('link', { name: 'Logout' });

  /**
   * Fill in the sign-in form and submit it.
   * @param username The account name to enter.
   * @param password The password to enter.
   */
  async signIn(username: string, password: string) {
    await this.page.getByLabel('Username').fill(username);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
  }
}
