import { getQueue } from './_helpers';
import { SchemaComposer } from 'graphql-compose';
import { getJobTC, getJobOptionsInputTC } from '../types/job';

export function createJobAddFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: {
      name: 'JobAddPayload',
      fields: {
        job: getJobTC(schemaComposer),
      },
    },
    args: {
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: getJobOptionsInputTC(schemaComposer),
    },
    resolve: async (_, { queueName, jobName, data, options }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
