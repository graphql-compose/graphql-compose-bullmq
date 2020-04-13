import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueue } from './helpers/queueGet';

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
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      delayed: {
        type: 'Boolean',
        defaultValue: false,
      },
    },
    resolve: async (_, { prefix, queueName, delayed }) => {
      const queue = getQueue(prefix, queueName);
      await queue.drain(delayed);
      return {};
    },
  };
}
