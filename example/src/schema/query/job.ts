export function createJobFC({ JobTC }) {
  return {
    type: JobTC,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, { Queues }) => {
      const queue = Queues.get(queueName);
      if (!queue) return null;
      const job = await queue.getJob(id);
      if (!job) return null;
      return job;
    },
  };
}
