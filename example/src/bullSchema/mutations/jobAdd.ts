import { generateMutation } from './generator';

export default function createMutation({ schemaComposer, JobTC, JobOptionsInputTC }) {
  const JobAddPayload = schemaComposer.createObjectTC({
    name: 'JobAddPayload',
    fields: {
      job: JobTC,
    },
  });

  return generateMutation<{ queueName: string; jobName: string; data: Object; options: Object }>({
    type: JobAddPayload,
    args: {
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: JobOptionsInputTC,
    },
    resolve: async (_, { jobName, data, options }, { Queue }) => {
      const job = await Queue.add(jobName, data, options);
      return {
        job,
      };
    },
  });
}
