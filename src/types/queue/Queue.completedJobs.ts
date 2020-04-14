import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Queue } from 'bullmq';
import { getJobTC } from '../job/Job';
import { Options } from '../../definitions';

export function createCompletedJobsFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobTC(sc, opts).getTypePlural(),
    args: {
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: 20,
      },
    },
    resolve: async (queue: Queue, { start, end }) => {
      return queue.getCompleted(start, end);
    },
  };
}
