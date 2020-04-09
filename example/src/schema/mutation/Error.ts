import { ErrorCodeEnum } from '../types';

export class MutationError extends Error {
  constructor(message: string, public code: ErrorCodeEnum) {
    super(message);
    Object.setPrototypeOf(this, MutationError.prototype);
  }
}
