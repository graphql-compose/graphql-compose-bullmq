import { getQueue } from './helpers/wrapMutationFC';
import { getJobStatusEnumTC } from '../types';

export function createQueueCleanFC({ schemaComposer }) {
  return {
    description:
      'Cleans jobs from a queue. Similar to remove but keeps jobs within a certain grace period',
    type: {
      name: 'QueueCleanPayload',
      fields: {
        jobsId: '[String!]', //TODO: Queue.clean возвращает список очищенных id
      },
    },
    args: {
      queueName: 'String!',
      filter: schemaComposer.createInputTC({
        name: 'QueueCleanFilter',
        fields: {
          grace: 'Int!',
          status: {
            type: getJobStatusEnumTC(schemaComposer),
            defaultValue: 'completed',
          },
          limit: {
            type: 'Int',
            defaultValue: 0,
          },
        },
      }),
    },
    resolve: async (_, { queueName, filter: { grace, status, limit } }, context) => {
      const queue = getQueue(queueName, context);
      const jobsId = await queue.clean(grace, limit, status);
      return {
        jobsId,
      };
    },
  };
}
