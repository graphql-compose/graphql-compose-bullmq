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
      let amount = 0;
      let counter = 0;
      if (jobs.length === 0) {
        return 0;
      } else {
        for (const job of jobs) {
          if (job?.finishedOn && job?.processedOn) {
            amount += job.finishedOn - job.processedOn;
            counter++;
          }
        }
        return (amount / (counter || 1)).toFixed(0);
      }
    },
  };
}
