// Use the public demo by default. Set UI_BASE_URL to run the same tests against another copy.
export const uiBaseURL = process.env.UI_BASE_URL ?? 'https://practice.expandtesting.com';

// Use API_BASE_URL when it is set. Otherwise the Notes API is on the same site as the UI.
const configuredApiURL = process.env.API_BASE_URL ?? new URL('/notes/api/', uiBaseURL).href;
// Keep a trailing slash so paths such as users/login are added after the Notes API root.
export const apiBaseURL = configuredApiURL.endsWith('/') ? configuredApiURL : configuredApiURL + '/';
