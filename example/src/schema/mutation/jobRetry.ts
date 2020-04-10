import { MutationError, ErrorCodeEnum } from './helpers/Error';
import { JobStatusEnum, getJobStatusEnumTC } from '../types';
import { getQueue } from './helpers/wrapMutationFC';

export function createJobRetryFC({ schemaComposer }) {
  return {
    type: {
      name: 'JobRetryPayload',
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
      await job.retry();
      return {
        id,
        state: JobStatusEnum.ACTIVE,
      };
    },
  };
}
