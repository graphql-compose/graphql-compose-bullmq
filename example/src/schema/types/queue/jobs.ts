import { Queue } from 'bullmq';

export function createJobsFC({ JobTC }) {
  return {
    type: [JobTC],
    args: {
      status: 'JobStatusEnum',
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
