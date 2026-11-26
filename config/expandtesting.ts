import { resolveEnvironment } from './environment';

// The example suites use ExpandTesting when the environment variables are unset.
export const { uiBaseURL, apiBaseURL } = resolveEnvironment(
  'https://practice.expandtesting.com',
  '/notes/api/',
);
