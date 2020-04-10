import { createLogsFC } from './logs';
import { createStateFC } from './state';
import { createRepeatOptionsTC } from './RepeatOptionsInterface';
import { SchemaComposer } from 'graphql-compose';

export function getJobTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateOTC('Job', (etc) => {
    etc.addFields({
      id: 'String!',
      name: 'String!',
      data: 'JSON!',
      progress: 'Int',
      delay: 'Int',
      timestamp: 'Date!',
      attemptsMade: 'Int',
      failedReason: 'JSON',
      stacktrace: '[String!]',
      returnvalue: 'JSON',
      finishedOn: 'Date',
      processedOn: 'Date',
      opts: sc.createObjectTC({
        name: 'JobOptionsOutput',
        fields: {
          priority: 'Int',
          delay: 'Int',
          attempts: 'Int',
          repeat: createRepeatOptionsTC(sc),
          backoff: 'Int', // | TODO: BackoffOptions
          lifo: 'Boolean',
          timeout: 'Int',
          jobId: 'String',
          removeOnComplete: 'Int', //TODO: bool | int - разнести
          removeOnFail: 'Int', //bool | int
          stackTraceLimit: 'Int',
        },
      }),
      state: createStateFC(sc),
      logs: createLogsFC(sc),
    });
  });
}
