import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createRemoveRepeatableFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueueRemoveRepeatablePayload`,
      fields: {
        key: 'String!',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      key: 'String!',
    },
    resolve: async (_, { prefix, queueName, key }) => {
      const queue = await findQueue(prefix, queueName, opts);
      await queue.removeRepeatableByKey(key);
      return {};
    },
  };
}
