import { getQueue } from './_helpers';

export function createQueueResumeFC() {
  return {
    type: {
      name: 'QueueResumePayload',
      fields: {
        queueName: 'String!',
      },
    },
    args: {
      queueName: 'String!',
    },
    resolve: async (_, { queueName }, context) => {
      const queue = getQueue(queueName, context);
      await queue.resume();
      return {};
    },
  };
}
