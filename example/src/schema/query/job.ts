import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Queue } from 'bullmq';
import { createBullConnection } from '../../connectRedis';

export function createJobFC(sc: SchemaComposer<any>) {
  return {
    type: getJobTC(sc),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { prefix, queueName, id }) => {
      const queue = new Queue(queueName, {
        prefix,
        connection: createBullConnection('queue'),
      });
      if (!queue) return null;
      const job = await queue.getJob(id);
      if (!job) return null;
      return job;
    },
  };
}
