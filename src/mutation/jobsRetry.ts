import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from '../helpers';
import { JobStatusEnum, getJobStatusEnumTC } from '../types';
import { findQueue } from '../helpers';
import { Options } from '../definitions';
import { getAsArray } from '../helpers/getAsArray';

export function createJobsRetryFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobsRetryPayload`,
      fields: {
        ids: '[String]',
        state: getJobStatusEnumTC(sc, opts),
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      ids: '[String!]!',
    },
    resolve: async (_, { prefix, queueName, ids }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const _ids = getAsArray(ids);

      if (_ids.length > 100) {
        throw new MutationError(
          'Arg. <id> constraint: send less than 100 IDs.',
          ErrorCodeEnum.OTHER_ERROR
        );
      }

      const promises: Promise<void>[] = [];

      for (const _id of _ids) {
        promises.push(
          queue.getJob(_id).then((job) => {
            if (!job)
              throw new MutationError(`Job ${_id} not found!`, ErrorCodeEnum.JOB_NOT_FOUND, _id);
            return job.retry();
          })
        );
      }

      //  Let there be a delay (await),
      // this will make the execution more obvious to client.
      await Promise.all(promises);

      return {
        ids,
        state: JobStatusEnum.WAITING,
      };
    },
  };
}
