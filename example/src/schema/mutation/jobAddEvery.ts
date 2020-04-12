import { getQueue } from './helpers/wrapMutationFC';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobAddEveryFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobAddEveryPayload',
      fields: {
        job: getJobTC(sc),
      },
    }),
    args: {
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: sc.createInputTC({
        name: 'JobOptionsInputEvery',
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
              name: 'JobOptionsInputRepeatEvery',
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
    resolve: async (_, { queueName, jobName, data, options }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.add(jobName, data, options);
      return {
        job,
      };
    },
  };
}
