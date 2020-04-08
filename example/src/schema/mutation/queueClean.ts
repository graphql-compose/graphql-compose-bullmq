import { getQueue } from './_helpers';

export function createQueueCleanFC({ schemaComposer, JobStatusEnumTC }) {
  return {
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
            type: JobStatusEnumTC,
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
