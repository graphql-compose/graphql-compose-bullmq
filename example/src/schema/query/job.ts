import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobFC(sc: SchemaComposer<any>) {
  return {
    type: getJobTC(sc),
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, { Queues }) => {
      const queue = Queues.get(queueName);
      if (!queue) return null;
      const job = await queue.getJob(id);
      if (!job) return null;
      return job;
    },
  };
}
