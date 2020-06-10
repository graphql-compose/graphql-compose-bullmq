import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';

export function createIdFC(): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: 'String!',
    resolve: async (queue: Queue) => {
      return queue.name;
    },
  };
}
