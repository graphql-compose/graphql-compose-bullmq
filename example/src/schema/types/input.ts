export function createInputTypes(schemaComposer) {
  const JobOptionsInputTC = schemaComposer.createInputTC({
    name: 'JobOptionsInput',
    fields: {
      priority: 'Int',
      delay: 'Int',
      attempts: 'Int',
      repeat: schemaComposer.createInputTC({
        name: 'CronRepeatOptionsInput',
        fields: {
          tz: 'String',
          endDate: 'Date',
          limit: 'Int',
          cron: 'String!', //TODO: добавить скалярный тип с проверкой по рег. выражению
          startDate: 'Date',
        },
      }),
      backoff: 'Int', // | TODO: BackoffOptions
      lifo: 'Boolean',
      timeout: 'Int',
      jobId: 'String',
      removeOnComplete: 'Boolean', //TODO: bool or int
      removeOnFail: 'Boolean', //TODO: bool or int
      stackTraceLimit: 'Int',
    },
  });

  return {
    JobOptionsInputTC,
  };
}
