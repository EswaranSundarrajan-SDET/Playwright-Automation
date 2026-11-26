// Read the same two environment variables for any application that uses the framework.
export function resolveEnvironment(defaultUiBaseURL: string, defaultApiPath: string) {
  const uiBaseURL = process.env.UI_BASE_URL ?? defaultUiBaseURL;
  const apiURL = process.env.API_BASE_URL ?? new URL(defaultApiPath, uiBaseURL).href;

  // A trailing slash keeps relative request paths under the API root.
  const apiBaseURL = apiURL.endsWith('/') ? apiURL : apiURL + '/';
  return { uiBaseURL, apiBaseURL };
}
