import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from '../helpers';
import { Options } from '../definitions';
import { getAsyncIterator } from '../helpers';
import { getQueueTC } from '../types/queue/Queue';

export function createOnJobRemovedFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: `${opts.typePrefix}OnJobRemovedPayload`,
      fields: {
        queue: getQueueTC(sc, opts).NonNull,
        jobId: 'String!',
        queueName: 'String!',
        prev: 'String',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async ({ jobId, prev }, { prefix, queueName }) => {
      const queue = getQueue(prefix, queueName, opts);
      return {
        queue,
        jobId,
        queueName,
        prev,
      };
    },
    subscribe: (_, { prefix, queueName }) => {
      return getAsyncIterator(prefix, queueName, 'removed', opts);
    },
  };
}
