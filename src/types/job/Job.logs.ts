import { Job, Queue } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Options } from '../../definitions';

export function createLogsFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  const { typePrefix } = opts;
  return {
    type: sc.createObjectTC({
      name: `${typePrefix}JobLogs`,
      fields: {
        count: 'Int',
        items: '[String]',
      },
      // args: {}, // TODO: start end
    }),
    resolve: (job: Job) => {
      // `queue` is private property of Job instance
      // so here we are not guarantee that log will be avaliable in the future
      if (job.id && (job as any).queue) {
        return ((job as any).queue as Queue)
          .getJobLogs(job.id)
          .then((r) => ({ count: r.count, items: r.logs }));
      }
    },
  };
}
