import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from './helpers/Error';
import { getJobStatusEnumTC } from '../types';
import { getQueue } from './helpers/wrapMutationFC';

export function createJobDiscardFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobDiscardPayload',
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(sc),
      },
    }),
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.discard();

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
