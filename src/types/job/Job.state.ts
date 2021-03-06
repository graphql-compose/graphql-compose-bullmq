import { Job } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { getJobStatusEnumTC } from '../scalars/JobStatusEnum';
import { Options } from '../../definitions';

export function createStateFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobStatusEnumTC(sc, opts),
    resolve: async (job: Job) => {
      return await job.getState();
    },
  };
}
