import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';

export function createQueuesFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc).getTypeNonNull().getTypePlural(),
    resolve: (_, __, { Queues }) => {
      return Queues.values();
    },
  };
}
