import { SchemaComposer } from 'graphql-compose';

export enum JobStatusEnum {
  COMPLETED = 'completed',
  WAITING = 'waiting',
  ACTIVE = 'active',
  DELAYED = 'delayed',
  FAILED = 'failed',
  PAUSED = 'paused',
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
