import { expect, type APIResponse } from '@playwright/test';

// Check the HTTP status and JSON content type before returning the parsed response.
export async function expectJson<T = unknown>(response: APIResponse, status = 200) {
  const url = response.url();
  const contentType = response.headers()['content-type'] ?? '';
  const jsonType = /^application\/(?:[^;\s]+\+)?json(?:\s*;|$)/i;
  const body: unknown = jsonType.test(contentType) ? await response.json() : undefined;
  const message = typeof body === 'object' && body !== null && 'message' in body
    && typeof body.message === 'string' ? body.message : undefined;

  // Show the server's message when it helps explain an unexpected status.
  expect(response.status(), [url, message].filter(Boolean).join(' — ')).toBe(status);
  expect(contentType, url).toMatch(jsonType);
  return body as T;
}
