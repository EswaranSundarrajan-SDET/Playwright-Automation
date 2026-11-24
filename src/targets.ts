export const uiBaseURL = process.env.UI_BASE_URL ?? 'https://practice.expandtesting.com';

const configuredApiURL = process.env.API_BASE_URL ?? new URL('/notes/api/', uiBaseURL).href;
export const apiBaseURL = configuredApiURL.endsWith('/') ? configuredApiURL : configuredApiURL + '/';
