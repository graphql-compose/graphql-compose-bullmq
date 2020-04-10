export class MutationError extends Error {
  constructor(message: string, public code: ErrorCodeEnum) {
    super(message);
    Object.setPrototypeOf(this, MutationError.prototype);
  }
}

export enum ErrorCodeEnum {
  QUEUE_NOT_FOUND = 'queue_not_found',
  JOB_NOT_FOUND = 'job_not_found',
  OTHER_ERROR = 'other_error',
}
