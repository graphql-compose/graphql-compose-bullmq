export function createLogsFC(schemaComposer) {
  return {
    type: schemaComposer.createObjectTC({
      name: 'JobLogs',
      fields: {
        count: 'Int',
        logs: '[String!]!',
      },
    }),
    resolve: async (job) => {
      return await job.queue.getJobLogs(job.id);
    },
  };
}
