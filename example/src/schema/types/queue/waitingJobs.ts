import { Queue } from 'bullmq';

export function createWaitingJobsFC({ JobTC }) {
  return {
    type: [JobTC],
    args: {
      tart: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: -1,
      },
    },
    resolve: async (queue: Queue, { status, start, end }) => {
      return await queue.getWaiting(start, end);
    },
  };
}
