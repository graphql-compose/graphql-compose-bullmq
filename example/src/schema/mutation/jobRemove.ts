import { findQueue } from './helpers/queueFind';
import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getJobTC } from '../types/job/Job';

export function createJobRremoveFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: sc.createObjectTC({
      name: 'JobRemovePayload',
      fields: {
        id: 'String',
        job: getJobTC(sc),
      },
    }),
    args: {
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { prefix, queueName, id }) => {
      const queue = await findQueue(prefix, queueName);
      const job = await queue.getJob(id);
      if (job) {
        await job.remove();
      }
      return {
        id,
        job,
      };
    },
  };
}
