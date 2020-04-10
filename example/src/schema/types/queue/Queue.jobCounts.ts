import { JobStatusEnum } from '../scalars/JobStatusEnum';
import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition, SchemaComposer } from 'graphql-compose';

export function createJobCountFC(
  schemaComposer: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
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
