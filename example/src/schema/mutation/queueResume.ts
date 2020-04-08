import { generateMutation, getQueue } from './_helpers';

export default function createQueuePauseMutation({ schemaComposer }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'QueueResumePayload',
      fields: {
        status: 'PayloadStatusEnum!',
        error: 'String',
        errorCode: 'ErrorCodeEnum',
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
  });
}
