import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from '../helpers';
import { getJobStatusEnumTC } from '../types';
import { findQueue } from '../helpers';
import { Options } from '../definitions';

export function createJobLogAddFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobLogAddPayload`,
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(sc, opts),
      },
    }),
    args: {
      id: 'String!',
      row: 'String!',
    },
    resolve: async (_, { prefix, queueName, id, row }) => {
      const queue = await findQueue(prefix, queueName);
      const job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      const logRes = await job.log(row);
      //TODO: в logRes похоже тупо количество записей в логе, подумать что с этим сотворить...

      return {
        id,
        state: await job.getState(),
      };
    },
  };
}
