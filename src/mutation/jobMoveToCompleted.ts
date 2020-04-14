import { findQueue } from '../helpers';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';
import { Options } from '../definitions';

export function jobMoveToCompletedFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobMoveToCompletedPayload`,
      fields: {
        id: 'String',
        job: getJobTC(sc, opts),
      },
    }),
    args: {
      id: 'String!',
    },
    resolve: async (_, { prefix, queueName, id }) => {
      const queue = await findQueue(prefix, queueName, opts);
      const job = await queue.getJob(id);
      if (job) {
        await job.moveToCompleted({}, 'tokenmustbehere'); //TODO: нати где брать токен
      }
      return {
        id,
        job,
      };
    },
  };
}
