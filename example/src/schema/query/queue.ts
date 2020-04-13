import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { getQueue } from './_helpers';

export function createQueueFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
    },
    resolve: async (_, { prefix, queueName }) => {
      return getQueue(prefix, queueName);
    },
  };
}
