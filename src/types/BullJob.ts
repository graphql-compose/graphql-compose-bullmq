import { SchemaComposer, schemaComposer } from 'graphql-compose';

export default function getJobType(opts: { schemaComposer: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  return sc.getOrCreateOTC('BullJob', (tc) => {
    tc.addFields({
      progress: 'Float',
      returnvalue: 'JSON',
      stacktrace: 'String[]',
      timestamp: 'Date',
      attemptsMade: 'Int',
      failedReason: 'String',
      finishedOn: 'Date',
      processedOn: 'Date',
    });
  });
}
