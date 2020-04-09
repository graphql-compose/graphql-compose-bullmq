import { isObject } from 'graphql-compose';

//TODO: Это не готово!

export function createRepeatOptionsTC(schemaComposer) {
  const RepeatOptionsInterfaceTC = schemaComposer.createInterfaceTC({
    name: 'RepeatOptionsInterface',
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: 'Int',
    },
  });

  const CronRepeatOptionsTC = schemaComposer
    .createObjectTC({
      name: 'CronRepeatOptions',
      fields: {
        tz: 'String',
        endDate: 'Date',
        limit: 'Int',
        cron: 'String!', //TODO: добавить скалярный тип с проверкой по рег. выражению
        startDate: 'Date',
      },
    })
    .setInterfaces([RepeatOptionsInterfaceTC]);

  const EveryRepeatOptionsTC = schemaComposer
    .createObjectTC({
      name: 'EveryRepeatOptions',
      fields: {
        tz: 'String',
        endDate: 'Date',
        limit: 'Int',
        every: 'String!',
      },
    })
    .setInterfaces([RepeatOptionsInterfaceTC]);

  RepeatOptionsInterfaceTC.addTypeResolver(EveryRepeatOptionsTC, (value) => {
    return isObject(value) && value.hasOwnProperty('every');
  });

  RepeatOptionsInterfaceTC.addTypeResolver(CronRepeatOptionsTC, (value) => {
    return isObject(value) && value.hasOwnProperty('cron');
  });

  return schemaComposer.createUnionTC({
    name: 'RepeatOptionsUnion',
    types: [CronRepeatOptionsTC, EveryRepeatOptionsTC],
    resolveType(value) {
      if (isObject(value) && value.hasOwnProperty('cron')) {
        return 'CronRepeatOptions';
      }
      if (isObject(value) && value.hasOwnProperty('every')) {
        return 'EveryRepeatOptions';
      }
      return null;
    },
  });
}
