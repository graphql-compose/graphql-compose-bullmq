import { MutationError } from './Error';
import { ErrorCodeEnum, JobStatusEnum, getJobStatusEnumTC } from '../types';
import { getQueue } from './_helpers';

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
