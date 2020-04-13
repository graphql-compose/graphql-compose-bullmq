import { SchemaComposer } from 'graphql-compose';
import { normalizePrefixGlob, fetchQueueTitles } from './_helpers';

export function createQueueKeysFC(sc: SchemaComposer<any>) {
  return {
    type: sc
      .createObjectTC({
        name: 'QueueKeysResult',
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
      return fetchQueueTitles(normalizePrefixGlob(prefixGlob));
    },
  };
}
