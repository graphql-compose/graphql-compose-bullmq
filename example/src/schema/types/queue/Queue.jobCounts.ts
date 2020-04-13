import { JobStatusEnum } from '../scalars/JobStatusEnum';
import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition, SchemaComposer } from 'graphql-compose';

export function createJobCountFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: sc.createObjectTC({
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
      return queue.getJobCounts(
        JobStatusEnum.ACTIVE,
        JobStatusEnum.COMPLETED,
        JobStatusEnum.DELAYED,
        JobStatusEnum.PAUSED,
        JobStatusEnum.WAITING
      );
    },
  };
}
