import { getQueue } from './_helpers';

export function createQueuePauseFC() {
  return {
    type: {
      name: 'QueuePausePayload',
      fields: {
        queueName: 'String!',
      },
    },
    args: {
      queueName: 'String!',
    },
    resolve: async (_, { queueName }, context) => {
      const queue = getQueue(queueName, context);
      await queue.pause();
      return {};
    },
  };
}