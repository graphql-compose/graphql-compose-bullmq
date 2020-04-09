import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue';

export function createQueuesFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: getQueueTC(schemaComposer).getTypeNonNull().getTypePlural(),
    resolve: (_, __, { Queues }) => {
      return Queues.values();
    },
  };
}
