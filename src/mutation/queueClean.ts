import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { getJobStatusEnumTC } from '../types';
import { Options } from '../definitions';

export function createQueueCleanFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    description:
      'Cleans jobs from a queue. Similar to remove but keeps jobs within a certain grace period',
    type: sc.createObjectTC({
      name: `${typePrefix}QueueCleanPayload`,
      fields: {
        jobsId: '[String!]', //TODO: Queue.clean возвращает список очищенных id
      },
    }),
    args: {
      filter: sc.createInputTC({
        name: `${typePrefix}QueueCleanFilter`,
        fields: {
          grace: 'Int!',
          status: {
            type: getJobStatusEnumTC(sc, opts),
            defaultValue: 'completed',
          },
          limit: {
            type: 'Int',
            defaultValue: 0,
          },
        },
      }),
    },
    resolve: async (_, { prefix, queueName, filter: { grace, status, limit } }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const jobsId = await queue.clean(grace, limit, status);
      return {
        jobsId,
      };
    },
  };
}
