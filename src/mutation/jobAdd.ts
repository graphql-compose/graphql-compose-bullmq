import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { findQueue } from '../helpers';
import { Options } from '../definitions';
import { createJobDataITC } from '../types/job/JobInput';
import { checkJobDataSize } from '../helpers/roughSizeOfObject';

export function createJobAddFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobAddPayload`,
      fields: {
        job: getJobTC(sc, opts),
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      jobName: 'String!',
      data: {
        type: () => createJobDataITC(sc, opts),
      },
      options: sc.createInputTC({
        name: `${typePrefix}JobOptionsInput`,
        fields: {
          priority: 'Int',
          delay: 'Int',
          attempts: 'Int',
          backoff: 'JSON', // | TODO: BackoffOptions
          lifo: 'Boolean',
          timeout: 'Int',
          jobId: 'String',
          removeOnComplete: 'Boolean', //TODO: bool or int
          removeOnFail: 'Boolean', //TODO: bool or int
          stackTraceLimit: 'Int',
        },
      }),
    },
    resolve: async (_, { prefix, queueName, jobName, data, options }) => {
      checkJobDataSize(opts, data);
      const queue = await findQueue(prefix, queueName, opts);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
