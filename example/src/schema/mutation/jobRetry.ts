import { PayloadError } from '../../declarations/errors';
import { JobStatusEnum, ErrorCodeEnum } from '../types/enums';
import { generateMutation, getQueue } from './_helpers';

export function createJobRetryFC({ schemaComposer, JobStatusEnumTC }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'JobRetryPayload',
      fields: {
        id: 'String',
        state: JobStatusEnumTC,
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.getJob(id);
      if (!job) throw new PayloadError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.retry();
      return {
        id,
        state: JobStatusEnum.ACTIVE,
      };
    },
  });
}
