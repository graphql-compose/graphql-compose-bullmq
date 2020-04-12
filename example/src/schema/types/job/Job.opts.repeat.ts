import { isObject, SchemaComposer } from 'graphql-compose';

export function createRepeatOptionsTC(sc: SchemaComposer<any>) {
  const RepeatOptionsInterfaceTC = sc.createInterfaceTC({
    name: 'RepeatOptionsInterface',
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
    },
  });

  const RepeatOptionsCronTC = sc.createObjectTC({
    name: 'RepeatOptionsCron',
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
    name: 'RepeatOptionsEvery',
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

  sc.addSchemaMustHaveType(RepeatOptionsEveryTC);
  sc.addSchemaMustHaveType(RepeatOptionsCronTC);

  return RepeatOptionsInterfaceTC;
}
