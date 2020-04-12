import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { Queue } from 'bullmq';
import { createBullConnection } from '../../connectRedis';

export function createQueueFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc),
    args: {
      queueName: 'String!',
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
    },
    resolve: async (_, { queueName, prefix }) => {
      const queue = new Queue(queueName, {
        prefix,
        connection: createBullConnection('queue'),
      });

      return queue;
    },
  };
}
