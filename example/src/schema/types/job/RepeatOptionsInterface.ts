import { isObject, SchemaComposer } from 'graphql-compose';

export function createRepeatOptionsTC(schemaComposer: SchemaComposer<any>) {
  const RepeatOptionsInterfaceTC = schemaComposer.createInterfaceTC({
    name: 'RepeatOptionsInterface',
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
    },
  });

  const RepeatOptionsCronTC = schemaComposer.createObjectTC({
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

  const RepeatOptionsEveryTC = schemaComposer.createObjectTC({
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

  schemaComposer.addSchemaMustHaveType(RepeatOptionsEveryTC);
  schemaComposer.addSchemaMustHaveType(RepeatOptionsCronTC);

  return RepeatOptionsInterfaceTC;
}
