import { JobStatusEnum } from '../enums';
import { Queue } from 'bullmq';

export function createJobCountFC(schemaComposer) {
  return {
    type: schemaComposer.createObjectTC({
      name: 'JobCounts',
      fields: {
        active: 'Int',
        completed: 'Int',
        failed: 'Int',
        delayed: 'Int',
        waiting: 'Int',
      },
    }),
    resolve: async (queue: Queue) => {
      return await queue.getJobCounts(
        JobStatusEnum.ACTIVE,
        JobStatusEnum.COMPLETED,
        JobStatusEnum.DELAYED,
        JobStatusEnum.PAUSED,
        JobStatusEnum.WAITING
      );
    },
  };
}
