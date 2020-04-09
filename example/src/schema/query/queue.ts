import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue';
import { Queue } from 'bullmq';
import { createBullConnection } from '../../connectRedis';

export function createQueueFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: getQueueTC(schemaComposer),
    args: {
      queueName: 'String!',
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
    },
    resolve: async (_, { queueName, prefix }) => {
      return new Queue(queueName, {
        prefix,
        connection: createBullConnection('queue'),
      });
    },
  };
}
