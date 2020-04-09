import { SchemaComposer } from 'graphql-compose';
import { Queue } from 'bullmq';
import { getJobTC } from '../job';

export function createCompletedJobsFC(schemaComposer: SchemaComposer<any>) {
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
      return await queue.getCompleted(start, end);
    },
  };
}
