import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { fetchQueueTitles, getQueues } from './_helpers';

export function createQueuesFC(sc: SchemaComposer<any>) {
  return {
    type: getQueueTC(sc).getTypeNonNull().getTypePlural(),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
    },
    resolve: async (_, { prefix }) => {
      const titles = await fetchQueueTitles(prefix);
      return getQueues(titles);
    },
  };
}
