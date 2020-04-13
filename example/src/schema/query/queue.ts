import { SchemaComposer } from 'graphql-compose';
import { getQueueTC } from '../types/queue/Queue';
import { getQueue } from './_helpers';
import { Options } from '../OptionsType';

export function createQueueFC(sc: SchemaComposer<any>, opts: Options) {
  return {
    type: getQueueTC(sc, opts),
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
