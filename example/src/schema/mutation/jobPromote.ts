import { MutationError } from './helpers/Error';
import { ErrorCodeEnum, getJobStatusEnumTC } from '../types';
import { getQueue } from './helpers/wrapMutationFC';

export function createjobPromoteFC({ schemaComposer }) {
  return {
    type: {
      name: 'JobPromotePayload',
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(schemaComposer),
      },
    },
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
