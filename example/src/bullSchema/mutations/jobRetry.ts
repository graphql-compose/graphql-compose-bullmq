import { PayloadError } from './../../declarations/errors';
import { JobStatusEnum, ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer }) {
  const JobRetryPayload = schemaComposer.createObjectTC({
    name: 'JobRetryPayload',
    fields: {
      id: 'String',
      state: 'JobStatusEnum',
    },
  });

  return generateMutation<{ queueName: string; id: string }>({
    type: JobRetryPayload,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { id }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      await job.retry();

      return {
        id,
        state: JobStatusEnum.ACTIVE,
      };
    },
  });
}
