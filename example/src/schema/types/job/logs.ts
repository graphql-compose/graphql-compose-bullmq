import { Job } from 'bullmq';
import { SchemaComposer } from 'graphql-compose';

export function createLogsFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: schemaComposer.createObjectTC({
      name: 'JobLogs',
      fields: {
        count: 'Int',
        logs: '[String!]!',
      },
    }),
    resolve: async (job: Job) => {
      return await job.queue.getJobLogs(job.id);
    },
  };
}
