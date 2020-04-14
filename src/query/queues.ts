import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { fetchQueueTitles, getQueues } from '../helpers';
import { Options } from '../definitions';

export function createQueuesFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
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