import { generateMutation } from './generator';

export default function createQueuePauseMutation({ schemaComposer }) {
  const QueueResumePayload = schemaComposer.createObjectTC({
    name: 'QueueResumePayload',
    fields: {
      status: 'PayloadStatusEnum!',
      error: 'String',
      errorCode: 'ErrorCodeEnum',
      queueName: 'String!',
    },
  });

  return generateMutation<{ queueName: string }>({
    type: QueueResumePayload,
    args: {
      queueName: 'String!',
    },
    resolve: async (_, __, { Queue }) => {
      await Queue.resume();
      return {};
    },
  });
}
