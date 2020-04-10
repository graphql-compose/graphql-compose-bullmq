import { getQueue } from './helpers/wrapMutationFC';

export function createRemoveRepeatableFC() {
  return {
    type: {
      name: 'QueueRemoveRepeatablePayload',
      fields: {
        key: 'String!',
      },
    },
    args: {
      queueName: 'String!',
      key: 'String!',
    },
    resolve: async (_, { queueName, key }, context) => {
      const queue = getQueue(queueName, context);
      await queue.removeRepeatableByKey(key);
      return {};
    },
  };
}
