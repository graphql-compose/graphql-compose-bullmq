import { ErrorCodeEnum } from '../schema/gqlTypes/enums';

export class PayloadError extends Error {
  constructor(message: string, public code: ErrorCodeEnum) {
    super(message);
    Object.setPrototypeOf(this, PayloadError.prototype);
  }
}
