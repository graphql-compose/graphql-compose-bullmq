import { PayloadError } from './../../declarations/errors';
import { ErrorCodeEnum } from './../gqlTypes/enums';
import { generateMutation } from './generator';

export default function createMutation({ schemaComposer }) {
  const JobLogAddPayload = schemaComposer.createObjectTC({
    name: 'JobLogAddPayload',
    fields: {
      id: 'String',
      state: 'JobStatusEnum',
    },
  });

  return generateMutation<{ queueName: string; id: string; row: string }>({
    type: JobLogAddPayload,
    args: {
      queueName: 'String!',
      id: 'String!',
      row: 'String!',
    },
    resolve: async (_, { id, row }, { Queue }) => {
      let job = await Queue.getJob(id);
      if (!job) throw new PayloadError(ErrorCodeEnum.JOB_NOT_FOUND, 'Job not found!');
      const logRes = await job.log(row);
      //TODO: в logRes похоже тупо количество записей в логе, подумать что с этим сотворить...

      return {
        id,
        state: await job.getState(),
      };
    },
  });
}
