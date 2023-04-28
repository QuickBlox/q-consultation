import { QBError } from 'quickblox';

export function isQBError(error: unknown): error is QBError {
  return typeof error === 'object' && error !== null && 'message' in error;
}
