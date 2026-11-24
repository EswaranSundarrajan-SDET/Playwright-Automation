import { expect, type APIResponse } from '@playwright/test';

export async function expectJson(response: APIResponse, status: number) {
  const context = response.url();
  const contentType = response.headers()['content-type'];
  const body: unknown = contentType?.includes('application/json')
    ? await response.json()
    : undefined;
  const errorMessage = typeof body === 'object' && body !== null && 'message' in body
    && typeof body.message === 'string' ? body.message : undefined;

  expect(response.status(), [context, errorMessage].filter(Boolean).join(' — ')).toBe(status);
  expect(contentType, context).toContain('application/json');
  expect(body, context).toMatchObject({
    success: status < 400,
    status,
    message: expect.any(String),
  });
  return body as { success: boolean; status: number; message: string; data?: unknown };
}

export async function expectData<T>(response: APIResponse, status = 200) {
  const body = await expectJson(response, status);
  expect(body.data, response.url()).toBeDefined();
  return body.data as T;
}
