import { PayloadError } from './../../declarations/errors';
import { ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer, JobTC }) {
  const JobUpdatePayload = schemaComposer.createObjectTC({
    name: 'JobUpdatePayload',
    fields: {
      job: JobTC,
    },
  });

  return generateMutation<{ queueName: string; id: string; data: Object }>({
    type: JobUpdatePayload,
    args: {
      queueName: 'String!',
      id: 'String!',
      data: 'JSON!',
    },
    resolve: async (_, { id, data }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      await job.update(data); //Данные заменяются полностью
      job = await Queue.getJob(id);
      return {
        job,
      };
    },
  });
}
