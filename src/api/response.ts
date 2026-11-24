import { expect, type APIResponse } from '@playwright/test';

export async function expectJson(response: APIResponse, status: number) {
  const context = response.url();
  expect(response.status(), context).toBe(status);
  expect(response.headers()['content-type'], context).toContain('application/json');
  const body: unknown = await response.json();
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
