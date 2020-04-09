import { MutationError } from './Error';
import { ErrorCodeEnum, getJobStatusEnumTC } from '../types';
import { getQueue } from './_helpers';

export function createJobDiscardFC({ schemaComposer }) {
  return {
    type: {
      name: 'JobDiscardPayload',
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
      await job.discard();

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
