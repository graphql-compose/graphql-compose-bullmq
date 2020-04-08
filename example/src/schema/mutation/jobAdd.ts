import { getQueue } from './_helpers';

export function createJobAddFC({ JobTC, JobOptionsInputTC }) {
  return {
    type: {
      name: 'JobAddPayload',
      fields: {
        job: JobTC,
      },
    },
    args: {
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: JobOptionsInputTC,
    },
    resolve: async (_, { queueName, jobName, data, options }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
