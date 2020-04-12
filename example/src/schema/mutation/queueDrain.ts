import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from './helpers/wrapMutationFC';

export function createQueueDrainFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    description:
      'Drains the queue, i.e., removes all jobs that are waiting or delayed, but not active, completed or failed.',
    type: sc.createObjectTC({
      name: 'QueueDrainPayload',
    }),
    args: {
      queueName: 'String!',
      delayed: {
        type: 'Boolean',
        defaultValue: false,
      },
    },
    resolve: async (_, { queueName, delayed }, context) => {
      const queue = getQueue(queueName, context);
      await queue.drain(delayed);
      return {};
    },
  };
}
