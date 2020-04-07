import { generateMutation } from './_helpers';

export default function createMutation({ schemaComposer }) {
  const QueuePausePayload = schemaComposer.createObjectTC({
    name: 'QueuePausePayload',
    fields: {
      queueName: 'String!',
    },
  });

  return generateMutation<{ queueName: string }>({
    type: QueuePausePayload,
    args: {
      queueName: 'String!',
    },
    resolve: async (_, __, { Queue }) => {
      await Queue.pause();
      return {};
    },
  });
}
