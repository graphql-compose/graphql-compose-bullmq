import { findQueue } from '../helpers/queueFind';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Options } from '../definitions';

export function createJobAddBulkFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobAddBulkPayload`,
      fields: {
        jobs: getJobTC(sc, opts).getTypePlural(),
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
          name: `${typePrefix}JobAddInputBulk`,
          fields: {
            name: 'String!',
            data: 'JSON!',
            options: sc.createInputTC({
              name: `${typePrefix}JobOptionsInputBulk`,
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
