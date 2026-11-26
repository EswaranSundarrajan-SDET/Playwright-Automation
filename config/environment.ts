/** The website opened by UI tests. Set UI_BASE_URL to use your own copy. */
export const uiBaseUrl = process.env.UI_BASE_URL ?? 'https://the-internet.herokuapp.com';

/** The server that receives API calls. API_BASE_URL should point to the server root. */
export const apiBaseUrl = process.env.API_BASE_URL ?? 'https://restful-booker.herokuapp.com';

/** The public demo account used to ask Restful Booker for an access token. */
export const bookerAccount = {
  /** The account name accepted by the demo server. */
  username: process.env.BOOKER_USERNAME ?? 'admin',
  /** The password published in the demo API guide. */
  password: process.env.BOOKER_PASSWORD ?? 'password123',
};
