import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from '../helpers';
import { JobStatusEnum, getJobStatusEnumTC } from '../types';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createJobRetryFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobRetryPayload`,
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(sc, opts),
      },
    }),
    args: {
      id: 'String!',
    },
    resolve: async (_, { prefix, queueName, id }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      await job.retry();
      return {
        id,
        state: JobStatusEnum.ACTIVE,
      };
    },
  };
}
