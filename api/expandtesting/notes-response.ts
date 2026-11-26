import { expect, type APIResponse } from '@playwright/test';
import { expectJson } from '../../utils/response';

interface NotesResponse {
  success: boolean;
  status: number;
  message: string;
  data?: unknown;
}

// The Notes API includes these fields in every response.
export async function expectNotesResponse(response: APIResponse, status: number) {
  const body = await expectJson<NotesResponse>(response, status);
  expect(body, response.url()).toMatchObject({
    success: status < 400,
    status,
    message: expect.any(String),
  });
  return body;
}

// Use this for responses that must include data. The test checks the returned fields it needs.
export async function expectNotesData<T>(response: APIResponse, status = 200) {
  const body = await expectNotesResponse(response, status);
  expect(body.data, response.url()).toBeDefined();
  return body.data as T;
}
