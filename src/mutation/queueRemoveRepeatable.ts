import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createRemoveRepeatableFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueueRemoveRepeatablePayload`,
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      jobName: 'String',
      repeat: sc.createInputTC({
        name: `${typePrefix}JobOptionsInputRepeatRemove`,
        fields: {
          tz: 'String',
          endDate: 'Date',
          cron: 'String',
          every: 'String',
        },
      }).NonNull,
    },
    resolve: async (_, { prefix, queueName, jobName, repeat }) => {
      const queue = await findQueue(prefix, queueName, opts);
      await queue.removeRepeatable(jobName, repeat);
      return {};
    },
  };
}
