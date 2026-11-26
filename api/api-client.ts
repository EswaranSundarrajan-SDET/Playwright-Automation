import type { APIRequestContext } from '@playwright/test';

type RequestOptions = Omit<NonNullable<Parameters<APIRequestContext['fetch']>[1]>, 'method'>;
type Headers = Record<string, string>;

// Send HTTP requests through the request context opened for the current test.
export class ApiClient {
  constructor(
    private readonly context: APIRequestContext,
    private readonly headers: Headers = {},
  ) {}

  // Return a client with extra headers. Other clients keep their own settings.
  withHeaders(headers: Headers) {
    return new ApiClient(this.context, this.mergeHeaders(headers));
  }

  // Pass through Playwright options such as data, params, multipart, and timeout.
  request(method: string, path: string, options: RequestOptions = {}) {
    return this.context.fetch(path, {
      ...options,
      method,
      headers: this.mergeHeaders(options.headers),
    });
  }

  // Header names are case-insensitive. Headers for one request take priority.
  private mergeHeaders(overrides: Headers = {}) {
    return Object.fromEntries(
      [...Object.entries(this.headers), ...Object.entries(overrides)]
        .map(([name, value]) => [name.toLowerCase(), value]),
    );
  }
}
