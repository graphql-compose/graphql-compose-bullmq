import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from './helpers/Error';
import { getJobStatusEnumTC } from '../types';
import { getQueue } from './helpers/wrapMutationFC';

export function createJobLogAddFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobLogAddPayload',
      fields: {
        id: 'String',
        state: getJobStatusEnumTC(sc),
      },
    }),
    args: {
      queueName: 'String!',
      id: 'String!',
      row: 'String!',
    },
    resolve: async (_, { queueName, id, row }, context) => {
      const queue = getQueue(queueName, context);
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
