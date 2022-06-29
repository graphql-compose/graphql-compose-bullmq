import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Queue } from 'bullmq';
import { Options } from '../../definitions';
import { getZsetKeysMemoryUsageAvg } from '../../helpers';

export function createJobsMemoryUsageAvgFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: 'Int!',
    args: {
      keySetName: {
        type: sc.createEnumTC({
          name: `${opts?.typePrefix}KeySetNamesEnum`,
          values: {
            COMPLETED: { value: 'completed' },
            FAILED: { value: 'failed' },
          },
        }),
        defaultValue: 'completed',
      },
      limit: {
        type: 'Int',
        defaultValue: 100,
      },
    },
    resolve: async (queue: Queue, { limit, keySetName }) => {
      const avgBytes =
        (await getZsetKeysMemoryUsageAvg(
          queue.opts?.prefix || 'bull',
          queue.name,
          keySetName,
          limit,
          opts
        )) || 0;

      return avgBytes.toFixed(0);
    },
  };
}
