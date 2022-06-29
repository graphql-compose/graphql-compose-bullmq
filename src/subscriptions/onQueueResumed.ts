import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from '../helpers';
import { Options } from '../definitions';
import { getAsyncIterator } from '../helpers';
import { getQueueTC } from '../types/queue/Queue';

export function createOnQueueResumedFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: `${opts.typePrefix}OnQueueResumedPayload`,
      fields: {
        queue: getQueueTC(sc, opts).NonNull,
        queueName: 'String!',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async (_, { prefix, queueName }) => {
      const queue = getQueue(prefix, queueName, opts);
      return {
        queue,
        queueName,
      };
    },
    subscribe: (_, { prefix, queueName }) => {
      return getAsyncIterator(prefix, queueName, 'resumed', opts);
    },
  };
}
