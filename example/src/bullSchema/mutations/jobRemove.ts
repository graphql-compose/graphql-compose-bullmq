import { PayloadError } from './../../declarations/errors';
import { ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer, JobTC }) {
  const JobRemovePayload = schemaComposer.createObjectTC({
    name: 'JobRemovePayload',
    fields: {
      id: 'String',
      job: JobTC,
    },
  });

  return generateMutation<{ queueName: string; id: string }>({
    type: JobRemovePayload,
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { id }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      job = await Queue.getJob(id);
      await job.remove();
      return {
        job,
      };
    },
  });
}
