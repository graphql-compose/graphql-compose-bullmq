import { createLogsFC } from './logs';
import { createStateFC } from './state';
import { createRepeatOptionsTC } from './repeatOptionsUnion';
import { SchemaComposer } from 'graphql-compose';

export function createJobTC(schemaComposer: SchemaComposer<any>) {
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
      state: createStateFC(schemaComposer),
      logs: createLogsFC(schemaComposer),
    },
  });
}
