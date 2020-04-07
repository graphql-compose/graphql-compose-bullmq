import { generateMutation } from './generator';

export default function createMutation({ schemaComposer }) {
  const QueueRemoveRepeatablePayload = schemaComposer.createObjectTC({
    name: 'QueueRemoveRepeatablePayload',
    fields: {
      key: 'String!',
    },
  });

  return generateMutation<{ queueName: string; key: string }>({
    type: QueueRemoveRepeatablePayload,
    args: {
      queueName: 'String!',
      key: 'String!',
    },
    resolve: async (_, { key }, { Queue }) => {
      await Queue.removeRepeatableByKey(key);
      return {};
    },
  });
}
