import { expect, type APIResponse } from '@playwright/test';

// Check the HTTP status, the JSON content type, and the fields shared by Notes API responses.
export async function expectJson(response: APIResponse, status: number) {
  const context = response.url();
  const contentType = response.headers()['content-type'];
  // Read JSON only when the response says it is JSON. An error page can have another format.
  const body: unknown = contentType?.includes('application/json')
    ? await response.json()
    : undefined;
  const errorMessage = typeof body === 'object' && body !== null && 'message' in body
    && typeof body.message === 'string' ? body.message : undefined;

  // If the status is wrong, show the request URL and the server's message when one is available.
  expect(response.status(), [context, errorMessage].filter(Boolean).join(' — ')).toBe(status);
  expect(contentType, context).toContain('application/json');
  expect(body, context).toMatchObject({
    success: status < 400,
    status,
    message: expect.any(String),
  });
  return body as { success: boolean; status: number; message: string; data?: unknown };
}

// Use this for responses that must include data. The generic type helps the test read fields, which the
// test can check at runtime.
export async function expectData<T>(response: APIResponse, status = 200) {
  const body = await expectJson(response, status);
  expect(body.data, response.url()).toBeDefined();
  return body.data as T;
}
