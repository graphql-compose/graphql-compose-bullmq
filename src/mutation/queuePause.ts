import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createQueuePauseFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueuePausePayload`,
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async (_, { prefix, queueName }) => {
      const queue = await findQueue(prefix, queueName, opts);
      await queue.pause();
      return {};
    },
  };
}
