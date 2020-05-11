import { isObject, SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export function createRepeatOptionsTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;

  const RepeatOptionsInterfaceTC = sc.createInterfaceTC({
    name: `${typePrefix}RepeatOptionsInterface`,
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
    },
  });

  const RepeatOptionsCronTC = sc.createObjectTC({
    name: `${typePrefix}RepeatOptionsCron`,
    interfaces: [RepeatOptionsInterfaceTC],
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
      cron: 'String',
      startDate: 'Date',
    },
  });

  const RepeatOptionsEveryTC = sc.createObjectTC({
    name: `${typePrefix}RepeatOptionsEvery`,
    interfaces: [RepeatOptionsInterfaceTC],
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
      every: 'String',
    },
  });

  RepeatOptionsInterfaceTC.addTypeResolver(RepeatOptionsEveryTC, (value) => {
    return isObject(value) && value.hasOwnProperty('every');
  });

  RepeatOptionsInterfaceTC.addTypeResolver(RepeatOptionsCronTC, (value) => {
    return isObject(value) && value.hasOwnProperty('cron');
  });

  return RepeatOptionsInterfaceTC;
}
