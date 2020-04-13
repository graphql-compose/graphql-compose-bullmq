import { MutationError, ErrorCodeEnum } from './helpers/Error';
import { findQueue } from './helpers/queueFind';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Options } from '../OptionsType';

export function createJobUpdateFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobUpdatePayload`,
      fields: {
        job: getJobTC(sc, opts),
      },
    }),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      id: 'String!',
      data: 'JSON!',
    },
    resolve: async (_, { prefix, queueName, id, data }) => {
      const queue = await findQueue(prefix, queueName);
      let job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.update(data); //Данные заменяются полностью
      job = await queue.getJob(id);
      return {
        job,
      };
    },
  };
}
