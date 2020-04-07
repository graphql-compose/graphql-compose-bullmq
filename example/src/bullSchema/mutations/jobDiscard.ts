import { PayloadError } from './../../declarations/errors';
import { ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer }) {
  const JobDiscardPayload = schemaComposer.createObjectTC({
    name: 'JobDiscardPayload',
    fields: {
      id: 'String',
      state: 'JobStatusEnum',
    },
  });

  return generateMutation<{ queueName: string; id: string }>({
    type: JobDiscardPayload,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { id }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      await job.discard();

      return {
        id,
        state: await job.getState(),
      };
    },
  });
}
