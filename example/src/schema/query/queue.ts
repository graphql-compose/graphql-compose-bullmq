export function createQueueFC({ QueueTC }) {
  return {
    type: QueueTC,
    args: {
      queueName: 'String!',
    },
    resolve: async (_, { queueName }, { Queues }) => {
      return Queues.get(queueName);
    },
  };
}
