import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from './helpers/Error';
import { getJobStatusEnumTC } from '../types';
import { getQueue } from './helpers/wrapMutationFC';

export function createjobPromoteFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobPromotePayload',
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
      await job.promote();

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
