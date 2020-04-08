import { generateMutation, getQueue } from './_helpers';

export default function createMutation({ schemaComposer }) {
  return generateMutation(schemaComposer, {
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
  });
}
