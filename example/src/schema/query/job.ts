import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { getQueue } from './_helpers';
import { Options } from '../OptionsType';

export function createJobFC(sc: SchemaComposer<any>, opts: Options) {
  return {
    type: getJobTC(sc, opts),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { prefix, queueName, id }) => {
      const queue = getQueue(prefix, queueName);
      if (!queue) return null;
      const job = await queue.getJob(id);
      if (!job) return null;
      return job;
    },
  };
}
