import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from './helpers/wrapMutationFC';

export function createQueuePauseFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'QueuePausePayload',
    }),
    args: {
      queueName: 'String!',
    },
    resolve: async (_, { queueName }, context) => {
      const queue = getQueue(queueName, context);
      await queue.pause();
      return {};
    },
  };
}
