import { getQueue } from './_helpers';
import { SchemaComposer } from 'graphql-compose';
import { getJobTC } from '../types/job';

export function jobMoveToCompletedFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: {
      name: 'JobMoveToCompletedPayload',
      fields: {
        id: 'String',
        job: getJobTC(schemaComposer),
      },
    },
    args: {
      queueName: 'String!',
      id: 'String!',
    },
    resolve: async (_, { queueName, id }, context) => {
      const queue = getQueue(queueName, context);
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
