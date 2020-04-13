import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { Queue } from 'bullmq';
import { createBullConnection } from '../../connectRedis';

export function createQueueFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async (_, { prefix, queueName }) => {
      const queue = new Queue(queueName, {
        prefix,
        connection: createBullConnection('queue'),
      });

      return queue;
    },
  };
}
