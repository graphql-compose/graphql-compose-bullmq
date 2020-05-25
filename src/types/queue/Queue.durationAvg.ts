import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Queue } from 'bullmq';
import { Options } from '../../definitions';

export function createDurationAvgFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: 'Int!',
    args: {
      limit: {
        type: 'Int',
        defaultValue: 1000,
      },
    },
    resolve: async (queue: Queue, { limit }) => {
      const jobs = await queue.getCompleted(0, limit);

      const amount = jobs.reduce((acc, job) => {
        if (job?.finishedOn && job?.processedOn) {
          return acc + job.finishedOn - job?.processedOn;
        }

        return acc;
      }, 0);

      return (amount / jobs.length).toFixed(0);
    },
  };
}
