import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { fetchQueueTitles, getQueues } from './_helpers';
import { Options } from '../OptionsType';

export function createQueuesFC(sc: SchemaComposer<any>, opts: Options) {
  return {
    type: getQueueTC(sc, opts).getTypeNonNull().getTypePlural(),
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
