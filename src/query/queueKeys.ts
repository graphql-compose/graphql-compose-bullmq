import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { scanQueueTitles } from '../helpers';
import { Options } from '../definitions';

export function createQueueKeysFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;
  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueueKeysResult`,
      fields: {
        queueName: 'String!',
        prefix: 'String!',
      },
    }).List,
    args: {
      prefixGlob: {
        type: 'String',
        defaultValue: 'bull*',
      },
    },
    resolve: async (_, { prefixGlob }) => {
      return scanQueueTitles(prefixGlob, opts);
    },
  };
}
