import { SchemaComposer } from 'graphql-compose';

export enum JobStatusEnum {
  COMPLETED = 'completed',
  WAITING = 'waiting',
  ACTIVE = 'active',
  DELAYED = 'delayed',
  FAILED = 'failed',
  PAUSED = 'paused',
}

export enum MutationStatusEnum {
  OK = 'ok',
  ERROR = 'error',
}

export enum ErrorCodeEnum {
  QUEUE_NOT_FOUND = 'queue_not_found',
  JOB_NOT_FOUND = 'job_not_found',
  OTHER_ERROR = 'other_error',
}

export function getJobStatusEnumTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateETC('JobStatusEnum', (etc) => {
    etc.addFields({
      COMPLETED: { value: JobStatusEnum.COMPLETED },
      WAITING: { value: JobStatusEnum.WAITING },
      ACTIVE: { value: JobStatusEnum.ACTIVE },
      DELAYED: { value: JobStatusEnum.DELAYED },
      FAILED: { value: JobStatusEnum.FAILED },
      PAUSED: { value: JobStatusEnum.PAUSED }, //TODO: в bull написано что устарело, теперь все waiting
    });
  });
}

export function getMutationStatusEnumTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateETC('MutationStatusEnum', (etc) => {
    etc.addFields({
      OK: { value: MutationStatusEnum.OK },
      ERROR: { value: MutationStatusEnum.ERROR },
    });
  });
}

export function getMutationErrorCodeEnumTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateETC('MutationErrorCodeEnum', (etc) => {
    etc.addFields({
      QUEUE_NOT_FOUND: { value: ErrorCodeEnum.QUEUE_NOT_FOUND },
      JOB_NOT_FOUND: { value: ErrorCodeEnum.JOB_NOT_FOUND },
      OTHER_ERROR: { value: ErrorCodeEnum.OTHER_ERROR },
    });
  });
}
