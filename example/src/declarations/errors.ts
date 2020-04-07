import { ErrorCodeEnum } from '../bullSchema/gqlTypes/enums';

export class PayloadError extends Error {
  constructor(public code: ErrorCodeEnum, message: string) {
    super(message);
    Object.setPrototypeOf(this, PayloadError.prototype);
  }
}
