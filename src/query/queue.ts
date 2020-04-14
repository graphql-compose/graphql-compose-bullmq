import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { getQueue } from '../helpers';
import { Options } from '../definitions';

export function createQueueFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: getQueueTC(sc, opts),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async (_, { prefix, queueName }) => {
      return getQueue(prefix, queueName, opts);
    },
  };
}
