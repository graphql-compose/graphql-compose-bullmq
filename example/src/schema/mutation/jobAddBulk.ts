import { findQueue } from './helpers/queueFind';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobAddBulkFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobAddBulkPayload',
      fields: {
        jobs: getJobTC(sc).getTypePlural(),
      },
    }),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      jobs: sc
        .createInputTC({
          name: 'JobAddInputBulk',
          fields: {
            name: 'String!',
            data: 'JSON!',
            options: sc.createInputTC({
              name: 'JobOptionsInputBulk',
              fields: {
                priority: 'Int',
                delay: 'Int',
                attempts: 'Int',
                backoff: 'Int', // | TODO: BackoffOptions
                lifo: 'Boolean',
                timeout: 'Int',
                jobId: 'String',
                removeOnComplete: 'Boolean', //TODO: bool or int
                removeOnFail: 'Boolean', //TODO: bool or int
                stackTraceLimit: 'Int',
              },
            }),
          },
        })
        .getTypePlural(),
    },
    resolve: async (_, { prefix, queueName, jobs }) => {
      const queue = await findQueue(prefix, queueName);
      const jobsRes = await queue.addBulk(jobs);
      return {
        jobs: jobsRes,
      };
    },
  };
}
