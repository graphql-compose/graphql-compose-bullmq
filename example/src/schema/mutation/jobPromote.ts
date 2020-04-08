import { PayloadError } from '../../declarations/errors';
import { ErrorCodeEnum } from '../types/enums';
import { generateMutation, getQueue } from './_helpers';

export function createjobPromoteFC({ schemaComposer }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'JobPromotePayload',
      fields: {
        id: 'String',
        state: 'JobStatusEnum',
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
  });
}
