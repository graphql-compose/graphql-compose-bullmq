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
          prefixMaskNorm: 'String',
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
      if (nameCase >= 2) {
        prefixMaskNorm = prefixMaskNorm.split(':').slice(0, 2).join(':') + ':';
      } else if (nameCase === 1) {
        prefixMaskNorm += prefixMaskNorm.endsWith(':') ? '*:' : ':';
      } else {
        prefixMaskNorm += ':*:';
      }

      const keys = await connection.keys(prefixMaskNorm + 'meta');

      return keys.map((key) => {
        const parts = key.split(':');
        return {
          queueName: parts[1],
          prefix: parts[0],
          prefixMaskNorm,
        };
      });
    },
  };
}
