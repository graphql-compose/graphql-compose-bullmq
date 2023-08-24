import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { scanQueueTitles, getQueues } from '../helpers';
import { Options } from '../definitions';

export function createQueuesFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: getQueueTC(sc, opts).NonNull.List,
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      names: {
        type: '[String!]',
      },
    },
    resolve: async (_, { prefix, names }) => {
      //Если передали имена, значит они согласованы с префиксом (bull.[имя проекта]).
      const titles = names
        ? names.map((name: string) => ({ prefix, queueName: name }))
        : await scanQueueTitles(prefix, opts);
      return getQueues(titles, opts);
    },
  };
}
