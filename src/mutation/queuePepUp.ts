import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { addFixRecordToDelayStream } from '../helpers';
import { Options } from '../definitions';

export function createQueuePepUpFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueuePepUpPayload`,
      fields: { records: 'JSON' },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      checkExistence: {
        type: 'Boolean',
        defaultValue: true,
      },
    },
    resolve: async (_, { prefix, queueName, checkExistence }) => {
      const records = await addFixRecordToDelayStream(prefix, queueName, opts, checkExistence);
      return { records };
    },
  };
}
