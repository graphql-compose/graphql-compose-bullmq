export default function createQuery({ QueueTC }) {
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
