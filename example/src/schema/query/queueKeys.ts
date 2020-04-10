import { SchemaComposer } from 'graphql-compose';
import { createBullConnection } from '../../connectRedis';

export function createQueueKeysFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: schemaComposer
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
      const connection = createBullConnection('custom');

      let prefixGlobNorm = prefixGlob;
      const nameCase = prefixGlobNorm.split(':').length - 1;
      if (nameCase >= 2) {
        prefixGlobNorm = prefixGlobNorm.split(':').slice(0, 2).join(':') + ':';
      } else if (nameCase === 1) {
        prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '*:' : ':';
      } else {
        prefixGlobNorm += ':*:';
      }
      prefixGlobNorm += 'meta';

      const keys = await connection.keys(prefixGlobNorm);

      return keys.map((key) => {
        const parts = key.split(':');
        return {
          queueName: parts[1],
          prefix: parts[0],
        };
      });
    },
  };
}
