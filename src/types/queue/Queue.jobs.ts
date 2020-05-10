import { Queue } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { getJobStatusEnumTC } from '../scalars/JobStatusEnum';
import { getJobTC } from '../job/Job';
import { Options } from '../../definitions';

export function createJobsFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobTC(sc, opts).List,
    args: {
      status: getJobStatusEnumTC(sc, opts),
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: 20,
      },
      // TODO: add sorting
    },
    resolve: async (queue: Queue, { status, start, end }) => {
      return queue.getJobs([status], start, end, false);
    },
  };
}
