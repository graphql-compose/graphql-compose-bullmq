import { MutationError } from './Error';
import { ErrorCodeEnum, getJobStatusEnumTC } from '../types';
import { getQueue } from './_helpers';

export function createJobLogAddFC({ schemaComposer }) {
  return {
    type: {
      name: 'JobLogAddPayload',
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(schemaComposer),
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
      row: 'String!',
    },
    resolve: async (_, { queueName, id, row }, context) => {
      const queue = getQueue(queueName, context);
      const job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      const logRes = await job.log(row);
      //TODO: в logRes похоже тупо количество записей в логе, подумать что с этим сотворить...

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
