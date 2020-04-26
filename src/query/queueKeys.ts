import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { fetchQueueTitles } from '../helpers';
import { Options } from '../definitions';

export function createQueueKeysFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;
  return {
    type: sc
      .createObjectTC({
        name: `${typePrefix}QueueKeysResult`,
        fields: {
          queueName: 'String!',
          prefix: 'String!',
        },
      })
      .getTypePlural(),
    args: {
      prefixGlob: {
        type: 'String',
        defaultValue: 'bull*',
      },
    },
    resolve: async (_, { prefixGlob }) => {
      return fetchQueueTitles(prefixGlob, opts);
    },
  };
}
