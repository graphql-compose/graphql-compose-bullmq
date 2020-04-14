import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { getQueue } from '../helpers';
import { Options } from '../definitions';

export function createJobFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: getJobTC(sc, opts),
    args: {
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
