import { createLogsFC } from './logs';
import { createStateFC } from './state';
import { createRepeatOptionsTC } from './repeatOptionsUnion';

export function createJobTC(schemaComposer, { JobStatusEnumTC }) {
  return schemaComposer.createObjectTC({
    name: 'Job',
    fields: {
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
      opts: schemaComposer.createObjectTC({
        name: 'JobOptionsOutput',
        fields: {
          priority: 'Int',
          delay: 'Int',
          attempts: 'Int',
          repeat: createRepeatOptionsTC(schemaComposer),
          backoff: 'Int', // | TODO: BackoffOptions
          lifo: 'Boolean',
          timeout: 'Int',
          jobId: 'String',
          removeOnComplete: 'Int', //TODO: bool | int - разнести
          removeOnFail: 'Int', //bool | int
          stackTraceLimit: 'Int',
        },
      }),
      state: createStateFC({ JobStatusEnumTC }),
      logs: createLogsFC(schemaComposer),
    },
  });
}
