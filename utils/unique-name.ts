import { randomUUID } from 'node:crypto';

/**
 * Make a name that other tests can run alongside without sharing data.
 * @param prefix A short word that makes the test record easy to recognize.
 */
export function uniqueName(prefix: string): string {
  return `${prefix}-${randomUUID()}`;
}
