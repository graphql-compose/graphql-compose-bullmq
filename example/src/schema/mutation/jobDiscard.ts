import { PayloadError } from '../../declarations/errors';
import { ErrorCodeEnum } from '../gqlTypes/enums';
import { generateMutation, getQueue } from './_helpers';

export function createJobDiscardFC({ schemaComposer }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'JobDiscardPayload',
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
      await job.discard();

      return {
        id,
        state: await job.getState(),
      };
    },
  });
}
