import { createLogsFC } from './Job.logs';
import { createStateFC } from './Job.state';
import { createRepeatOptionsTC } from './Job.opts.repeat';
import { SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';
import { Job } from 'bullmq';

export function getJobTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix, jobDataTC = 'JSON!' } = opts;

  return sc.getOrCreateOTC(`${typePrefix}Job`, (etc) => {
    etc.addFields({
      id: 'String!',
      name: 'String',
      data: jobDataTC,
      progress: 'Int',
      delay: 'Int',
      timestamp: {
        type: 'Date',
        resolve: async (job: Job) => (job.timestamp ? job.timestamp : null),
      },
      attemptsMade: 'Int',
      failedReason: 'JSON',
      stacktrace: '[String]',
      returnvalue: 'JSON',
      finishedOn: 'Date',
      processedOn: 'Date',
      opts: sc.createObjectTC({
        name: `${typePrefix}JobOptionsOutput`,
        fields: {
          priority: 'Int',
          delay: 'Int',
          attempts: 'Int',
          repeat: createRepeatOptionsTC(sc, opts),
          backoff: 'JSON', // | TODO: BackoffOptions
          lifo: 'Boolean',
          timeout: 'Int',
          jobId: 'String',
          removeOnComplete: 'Int', //TODO: bool | int - разнести
          removeOnFail: 'Int', //bool | int
          stackTraceLimit: 'Int',
        },
      }),
      state: createStateFC(sc, opts),
      logs: createLogsFC(sc, opts),
    });
  });
}
