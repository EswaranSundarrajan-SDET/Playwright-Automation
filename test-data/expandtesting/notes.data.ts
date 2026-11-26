import { randomUUID } from 'node:crypto';
import type { Account, NoteDraft } from './notes.types';

// Use the same valid note fields as a starting point for the create and validation tests.
export const apiNoteDraft: NoteDraft = {
  title: 'Plan the regression run',
  description: 'Verify the browser and API suites.',
  category: 'Work',
};

// Start the hybrid test with a note created through the API.
export const seededNote: NoteDraft = {
  title: 'Seeded by the API',
  description: 'This note should appear after browser login.',
  category: 'Home',
};

// Create a separate note through the browser so the test can verify it through the API.
export const browserNote: NoteDraft = {
  title: 'Created in the browser',
  description: 'Verify the saved note through the REST API.',
  category: 'Work',
};

// Give each test its own account so parallel tests can use the Notes service independently.
export function createDemoAccount(): Account {
  // Use a short random ID to stay within the demo's field limits.
  const id = randomUUID().replaceAll('-', '').slice(0, 20);
  return {
    name: 'Playwright QA',
    email: `pw-${id}@example.com`,
    password: `Pw!-${id}`,
  };
}
