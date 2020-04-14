import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from '../helpers';
import { getJobStatusEnumTC } from '../types';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createjobPromoteFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobPromotePayload`,
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
      await job.promote();

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
