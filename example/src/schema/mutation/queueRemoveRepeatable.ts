import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from './helpers/wrapMutationFC';

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
      queueName: 'String!',
      key: 'String!',
    },
    resolve: async (_, { queueName, key }, context) => {
      const queue = getQueue(queueName, context);
      await queue.removeRepeatableByKey(key);
      return {};
    },
  };
}
