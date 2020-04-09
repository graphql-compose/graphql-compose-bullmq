import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue';

export function createQueueFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: getQueueTC(schemaComposer),
    args: {
      queueName: 'String!',
    },
    resolve: async (_, { queueName }, { Queues }) => {
      return Queues.get(queueName);
    },
  };
}
