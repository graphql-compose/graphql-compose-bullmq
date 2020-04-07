export default function createQuery({ JobTC }) {
  return {
    type: JobTC,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, { Queues }) => {
      const Queue = Queues.get(queueName);
      if (!Queue) return null;
      let job = await Queue.getJob(id);
      if (!job) return null;
      return job;
    },
  };
}
