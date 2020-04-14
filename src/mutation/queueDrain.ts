import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createQueueDrainFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    description:
      'Drains the queue, i.e., removes all jobs that are waiting or delayed, but not active, completed or failed.',
    type: sc.createObjectTC({
      name: `${typePrefix}QueueDrainPayload`,
    }),
    args: {
      delayed: {
        type: 'Boolean',
        defaultValue: false,
      },
    },
    resolve: async (_, { prefix, queueName, delayed }) => {
      const queue = await findQueue(prefix, queueName);
      await queue.drain(delayed);
      return {};
    },
  };
}
