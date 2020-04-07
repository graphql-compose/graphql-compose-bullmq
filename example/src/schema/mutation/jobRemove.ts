import { generateMutation, getQueue } from './_helpers';

export function createJobRremoveFC({ schemaComposer, JobTC }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'JobRemovePayload',
      fields: {
        id: 'String',
        job: JobTC,
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.getJob(id);
      if (job) {
        await job.remove();
      }
      return {
        id,
        job,
      };
    },
  });
}
