import { PayloadError } from '../../declarations/errors';
import { ErrorCodeEnum } from '../types/enums';
import { getQueue } from './_helpers';

export function createjobPromoteFC({ JobStatusEnumTC }) {
  return {
    type: {
      name: 'JobPromotePayload',
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
      await job.promote();

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
