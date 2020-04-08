import { PayloadError } from '../../declarations/errors';
import { ErrorCodeEnum } from '../types/enums';
import { generateMutation, getQueue } from './_helpers';

export function createJobUpdateFC({ schemaComposer, JobTC }) {
  return generateMutation(schemaComposer, {
    type: {
      name: 'JobUpdatePayload',
      fields: {
        job: JobTC,
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
      data: 'JSON!',
    },
    resolve: async (_, { queueName, id, data }, context) => {
      const queue = getQueue(queueName, context);
      let job = await queue.getJob(id);
      if (!job) throw new PayloadError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.update(data); //Данные заменяются полностью
      job = await queue.getJob(id);
      return {
        job,
      };
    },
  });
}
