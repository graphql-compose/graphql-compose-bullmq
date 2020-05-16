import { findQueue } from '../helpers';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Options } from '../definitions';

export function createJobRremoveBulkFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobRemoveBulkPayload`,
      fields: {
        jobIds: '[String!]',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      jobIds: '[String!]!',
    },
    resolve: async (_, { prefix, queueName, jobIds }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const deletedIds: string[] = [];
      for (let i = 0; i < jobIds.length; i++) {
        const job = await queue.getJob(jobIds[i]);
        if (job) {
          await job.remove();
          deletedIds.push(jobIds[i]);
        }
      }

      return {
        jobIds: deletedIds,
      };
    },
  };
}
