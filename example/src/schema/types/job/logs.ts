import { Job } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';

export function createLogsFC(
  schemaComposer: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: schemaComposer.createObjectTC({
      name: 'JobLogs',
      fields: {
        count: 'Int',
        logs: '[String!]',
      },
    }),
    resolve: (job: Job) => {
      // `queue` is private property of Job instance
      // so here we are not guarantee that log will be avaliable in the future
      if ((job as any).queue) {
        return (job as any).queue.getJobLogs(job.id);
      }
    },
  };
}
