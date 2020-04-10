import { getQueue } from './helpers/wrapMutationFC';
import {
  SchemaComposer,
  InputTypeComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

function getPayloadTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateOTC('JobAddPayload', (etc) => {
    etc.addFields({
      job: getJobTC(sc),
    });
  });
}

export function createJobAddFC(sc: SchemaComposer<any>) {
  return composeJobAddFC(sc, createJobOptionsInputTC('JobOptionsInput', sc));
}

export function createJobAddRepeatableCronFC(sc: SchemaComposer<any>) {
  return composeJobAddFC(
    sc,
    createJobOptionsInputTC('JobOptionsInputRepeatableCron', sc).addFields({
      repeat: sc
        .createInputTC({
          name: 'RepeatOptionsInputCron',
          fields: {
            tz: 'String',
            endDate: 'Date',
            limit: 'Int',
            cron: 'String!',
            startDate: 'Date',
          },
        })
        .getTypeNonNull(),
    })
  );
}

export function createJobAddRepeatableEveryFC(sc: SchemaComposer<any>) {
  return composeJobAddFC(
    sc,
    createJobOptionsInputTC('JobOptionsInputRepeatableEvery', sc).addFields({
      repeat: sc
        .createInputTC({
          name: 'RepeatOptionsInputEvery',
          fields: {
            tz: 'String',
            endDate: 'Date',
            limit: 'Int',
            cron: 'String!',
            startDate: 'Date',
          },
        })
        .getTypeNonNull(),
    })
  );
}

function composeJobAddFC(
  sc: SchemaComposer<any>,
  optionsTC: InputTypeComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: getPayloadTC(sc),
    args: {
      queueName: 'String!',
      jobName: 'String!',
      data: 'JSON!',
      options: optionsTC,
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

function createJobOptionsInputTC(name: string, sc: SchemaComposer<any>): InputTypeComposer<any> {
  return sc.createInputTC({
    name,
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
  });
}
