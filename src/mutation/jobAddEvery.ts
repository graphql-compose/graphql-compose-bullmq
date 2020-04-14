import { findQueue } from '../helpers';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Options } from '../definitions';

export function createJobAddEveryFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobAddEveryPayload`,
      fields: {
        job: getJobTC(sc, opts),
      },
    }),
    args: {
      jobName: 'String!',
      data: 'JSON!',
      options: sc.createInputTC({
        name: `${typePrefix}JobOptionsInputEvery`,
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
          repeat: sc
            .createInputTC({
              name: `${typePrefix}JobOptionsInputRepeatEvery`,
              fields: {
                tz: 'String',
                endDate: 'Date',
                limit: 'Int',
                every: 'String!',
              },
            })
            .getTypeNonNull(),
        },
      }),
    },
    resolve: async (_, { prefix, queueName, jobName, data, options }) => {
      const queue = await findQueue(prefix, queueName);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
