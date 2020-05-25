import { MutationError, ErrorCodeEnum } from './../helpers/MutationError';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { findQueue } from '../helpers';
import { deleteQueue } from '../helpers';
import { Options } from '../definitions';

export function createQueueDeleteFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}QueueDeletePayload`,
      fields: {
        total: 'Int',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      checkExistence: {
        type: 'Boolean',
        defaultValue: true,
      },
      checkActivity: {
        type: 'Boolean',
        defaultValue: true,
      },
    },
    resolve: async (_, { prefix, queueName, checkExistence, checkActivity }) => {
      if (checkActivity) {
        const queue = await findQueue(prefix, queueName, opts);
        const actives = await queue.getActiveCount();
        const workers = (await queue.getWorkers()).length;

        const messages: string[] = [];

        if (actives > 0) {
          messages.push(`Queue have ${actives} active jobs.`);
        }

        if (workers > 0) {
          messages.push(`Queue have ${workers} workers.`);
        }

        if (messages.length > 0) {
          throw new MutationError(
            ['Queue is active!', ...messages].join(' '),
            ErrorCodeEnum.OTHER_ERROR
          );
        }
      }
      const total = await deleteQueue(prefix, queueName, opts, checkExistence);
      return { total };
    },
  };
}
