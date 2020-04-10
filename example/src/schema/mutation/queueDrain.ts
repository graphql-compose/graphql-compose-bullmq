import { getQueue } from './helpers/wrapMutationFC';

export function createQueueDrainFC() {
  return {
    description:
      'Drains the queue, i.e., removes all jobs that are waiting or delayed, but not active, completed or failed.',
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
