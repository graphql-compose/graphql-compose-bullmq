import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { createBullConnection } from '../../connectRedis';
import { Queue } from 'bullmq';

export function createQueuesFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc).getTypeNonNull().getTypePlural(),
    resolve: async (_, __) => {
      const connection = createBullConnection('custom');
      const keys = await connection.keys('bull*:*:meta');

      return keys.map((key) => {
        const parts = key.split(':');
        return new Queue(parts[1], {
          prefix: parts[0],
          connection: createBullConnection('queue'),
        });
      });
    },
  };
}
