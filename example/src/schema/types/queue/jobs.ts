import { Queue } from 'bullmq';

export function createJobsFC({ JobTC, JobStatusEnumTC }) {
  return {
    type: [JobTC],
    args: {
      status: JobStatusEnumTC,
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: -1,
      },
    },
    resolve: async (queue: Queue, { status, start, end }) => {
      return await queue.getJobs([status], start, end, false);
    },
  };
}
