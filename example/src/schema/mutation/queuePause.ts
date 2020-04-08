import { generateMutation, getQueue } from './_helpers';

export default function createMutation({ schemaComposer }) {
  return generateMutation(schemaComposer, {
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
  });
}
