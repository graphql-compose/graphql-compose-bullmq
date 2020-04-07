import { PayloadError } from './../../declarations/errors';
import { ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer }) {
  const JobPromotePayload = schemaComposer.createObjectTC({
    name: 'JobPromotePayload',
    fields: {
      id: 'String',
      state: 'JobStatusEnum',
    },
  });

  return generateMutation<{ queueName: string; id: string }>({
    type: JobPromotePayload,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { id }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      await job.promote();

      return {
        id,
        state: await job.getState(),
      };
    },
  });
}
