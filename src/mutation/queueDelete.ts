import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { deleteQueue } from '../helpers';
import { Options } from '../definitions';

export function createQueueDeleteFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueueDeletePayload`,
      fields: {
        total: 'Int',
      },
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
      const total = await deleteQueue(prefix, queueName, opts, checkExistence);
      return { total };
    },
  };
}
