import { getQueue } from './_helpers';

export function createQueueDrainFC({ schemaComposer }) {
  return {
    type: {
      name: 'QueueDrainPayload',
      fields: {
        jobsId: '[String!]',
      },
    },
    args: {
      queueName: 'String!',
      delayed: {
        type: 'Boolean',
        defaultValue: false,
      },
    },
    resolve: async (_, { queueName, delayed }, context) => {
      const queue = getQueue(queueName, context);
      await queue.drain(delayed);
      return {};
    },
  };
}
