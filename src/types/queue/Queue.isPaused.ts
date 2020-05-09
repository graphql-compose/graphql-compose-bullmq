import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';

export function createIsPausedFC(): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: 'Boolean',
    resolve: async (queue: Queue) => {
      const client = await queue.client;
      const meta = await client.hgetall(queue.keys.meta);
      return meta?.paused ? !!+meta.paused : false;
    },
  };
}
