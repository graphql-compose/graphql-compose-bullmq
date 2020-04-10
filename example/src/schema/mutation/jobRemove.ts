import { getQueue } from './helpers/wrapMutationFC';
import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobRremoveFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: {
      name: 'JobRemovePayload',
      fields: {
        id: 'String',
        job: getJobTC(schemaComposer),
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.getJob(id);
      if (job) {
        await job.remove();
      }
      return {
        id,
        job,
      };
    },
  };
}
