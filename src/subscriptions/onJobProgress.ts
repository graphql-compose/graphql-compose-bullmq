import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { getQueue } from '../helpers';
import { Options } from '../definitions';
import { getAsyncIterator } from '../helpers';
import { getQueueTC } from '../types/queue/Queue';

export function createOnJobProgressFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'OnJobProgressPayload',
      fields: {
        job: getJobTC(sc, opts),
        queue: getQueueTC(sc, opts).NonNull,
        jobId: 'String!',
        queueName: 'String!',
        progress: 'Int',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async ({ jobId, data }, { prefix, queueName }) => {
      const queue = getQueue(prefix, queueName, opts);
      const job = await queue.getJob(jobId);
      return {
        job,
        queue,
        jobId,
        queueName,
        progress: parseInt(data),
      };
    },
    subscribe: (_, { prefix, queueName }) => {
      return getAsyncIterator(prefix, queueName, 'progress', opts);
    },
  };
}
