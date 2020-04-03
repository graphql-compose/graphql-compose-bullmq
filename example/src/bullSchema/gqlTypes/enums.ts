export enum StatusEnum {
  COMPLETED = 'completed',
  WAITING = 'waiting',
  ACTIVE = 'active',
  DELAYED = 'delayed',
  FAILED = 'failed',
  PAUSED = 'paused',
}

export enum PayloadStatusEnum {
  OK = 'ok',
  ERROR = 'error',
}

export enum ErrorCodeEnum {
  QUEUE_NOT_FOUND = 'queue_not_found',
  JOB_NOT_FOUND = 'job_not_found',
  OTHER_ERROR = 'other_error',
}

export default function ({ schemaComposer }) {
  const StatusEnumTC = schemaComposer.createEnumTC({
    name: 'StatusEnum',
    values: {
      COMPLETED: { value: StatusEnum.COMPLETED },
      WAITING: { value: StatusEnum.WAITING },
      ACTIVE: { value: StatusEnum.ACTIVE },
      DELAYED: { value: StatusEnum.DELAYED },
      FAILED: { value: StatusEnum.FAILED },
      PAUSED: { value: StatusEnum.PAUSED }, //TODO: в bull написано что устарело, теперь все waiting
    },
  });

  const PayloadStatusEnumTC = schemaComposer.createEnumTC({
    name: 'PayloadStatusEnum',
    values: {
      OK: { value: PayloadStatusEnum.OK },
      ERROR: { value: PayloadStatusEnum.ERROR },
    },
  });

  const ErrorCodeEnumTC = schemaComposer.createEnumTC({
    name: 'ErrorCodeEnum',
    values: {
      QUEUE_NOT_FOUND: { value: ErrorCodeEnum.QUEUE_NOT_FOUND },
      JOB_NOT_FOUND: { value: ErrorCodeEnum.JOB_NOT_FOUND },
      OTHER_ERROR: { value: ErrorCodeEnum.OTHER_ERROR },
    },
  });

  return {
    StatusEnumTC,
    PayloadStatusEnumTC,
    ErrorCodeEnumTC,
  };
}
