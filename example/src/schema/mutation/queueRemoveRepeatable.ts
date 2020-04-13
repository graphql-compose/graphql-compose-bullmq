import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from './helpers/queueFind';

export function createRemoveRepeatableFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'QueueRemoveRepeatablePayload',
      fields: {
        key: 'String!',
      },
    }),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      key: 'String!',
    },
    resolve: async (_, { prefix, queueName, key }) => {
      const queue = await findQueue(prefix, queueName);
      await queue.removeRepeatableByKey(key);
      return {};
    },
  };
}
