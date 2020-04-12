import { getQueue } from './helpers/wrapMutationFC';
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
    resolve: async (_, { queueName, jobs }, context) => {
      console.log('Я здесб!');
      const queue = getQueue(queueName, context);
      const jobsRes = await queue.addBulk(jobs);
      return {
        jobs: jobsRes,
      };
    },
  };
}
