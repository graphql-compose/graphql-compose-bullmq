import { SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export function createRepeatOptionsTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;

  const RepeatOptionsTC = sc.createObjectTC({
    name: `${typePrefix}RepeatOptions`,
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
      count: 'Int',
      prevMillis: 'Int',
      jobId: 'String',
      cron: 'String',
      startDate: 'Date',
      every: 'String',
    },
  });

  return RepeatOptionsTC;
}
