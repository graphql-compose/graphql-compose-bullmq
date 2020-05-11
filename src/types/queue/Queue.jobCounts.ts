import { JobStatusEnum } from '../scalars/JobStatusEnum';
import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition, SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export function createJobCountFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobCounts`,
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
        JobStatusEnum.FAILED,
        JobStatusEnum.WAITING
      );
    },
  };
}
