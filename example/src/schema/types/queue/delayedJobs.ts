import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Queue } from 'bullmq';
import { getJobTC } from '../job';

export function createDelayedJobsFC(
  schemaComposer: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobTC(schemaComposer).getTypePlural(),
    args: {
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: -1,
      },
    },
    resolve: async (queue: Queue, { start, end }) => {
      return await queue.getDelayed(start, end);
    },
  };
}
