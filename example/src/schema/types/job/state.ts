import { Job } from 'bullmq';

export function createStateFC({ JobStatusEnumTC }) {
  return {
    type: JobStatusEnumTC,
    resolve: async (job: Job) => {
      return await job.getState();
    },
  };
}
