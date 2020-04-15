import { MutationError, ErrorCodeEnum } from './../helpers/MutationError';
import { findQueue } from '../helpers';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Options } from '../definitions';

export function createJobMoveToDelayedFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    description: 'Moves job from active to delayed.',
    type: sc.createObjectTC({
      name: `${typePrefix}JobMoveToDelayedPayload`,
      fields: {
        job: getJobTC(sc, opts),
        willBeProcessedOn: 'Date',
      },
    }),
    args: {
      prefix: {
        type: 'String!',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      id: 'String!',
      delay: {
        type: 'Int!',
        defaultValue: 60000,
      },
    },
    resolve: async (_, { prefix, queueName, id, delay }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const job = await queue.getJob(id);
      if (!job) throw new MutationError('Job not found!', ErrorCodeEnum.JOB_NOT_FOUND);
      const willBeProcessedOn = Date.now() + delay;
      await job.moveToDelayed(willBeProcessedOn);
      return {
        willBeProcessedOn,
        job,
      };
    },
  };
}
