import { SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export enum JobStatusEnum {
  COMPLETED = 'completed',
  WAITING = 'waiting',
  ACTIVE = 'active',
  DELAYED = 'delayed',
  FAILED = 'failed',
  PAUSED = 'paused',
}

export function getJobStatusEnumTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;
  return sc.getOrCreateETC(`${typePrefix}JobStatusEnum`, (etc) => {
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
