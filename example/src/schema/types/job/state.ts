export function createStateFC({ JobStatusEnumTC }) {
  return {
    type: JobStatusEnumTC,
    resolve: async (job) => {
      return await job.getState();
    },
  };
}
