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
      prefixMask: {
        type: 'String',
        defaultValue: 'bull*',
      },
    },
    resolve: async (_, { prefixMask }) => {
      const connection = createBullConnection('custom');

      let prefixMaskNorm = prefixMask;
      const nameCase = prefixMaskNorm.split(':').length - 1;
      if (nameCase === 2) {
        prefixMaskNorm = prefixMaskNorm.endsWith('*')
          ? prefixMaskNorm.substr(0, prefixMaskNorm.length - 1)
          : prefixMaskNorm;
      } else if (nameCase === 1) {
        prefixMaskNorm += ':';
      } else {
        prefixMaskNorm += prefixMaskNorm.endsWith('*') ? ':*:' : '*:*:';
      }

      prefixMaskNorm += 'meta';

      const keys = await connection.keys(prefixMaskNorm);

      return keys.map((key) => {
        const parts = key.split(':');
        return {
          queueName: parts[0],
          prefix: parts[1],
        };
      });
    },
  };
}
