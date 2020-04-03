import { isObject } from '../utils';

export default function ({ schemaComposer, StatusEnumTC, UIntTC, UIntNonNullTC, BoolOrUIntTC }) {
  const RepeatOptionsInterfaceTC = schemaComposer.createInterfaceTC({
    name: 'RepeatOptionsInterface',
    fields: {
      tz: 'String',
      endDate: 'Date',
      limit: UIntTC,
    },
  });

  const CronRepeatOptionsTC = schemaComposer
    .createObjectTC({
      name: 'CronRepeatOptions',
      fields: {
        tz: 'String',
        endDate: 'Date',
        limit: UIntTC,
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
        limit: UIntTC,
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

  schemaComposer.createUnionTC({
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

  const JobOptionsTC = schemaComposer.createObjectTC({
    name: 'JobOptions',
    fields: {
      priority: 'Int',
      delay: UIntTC,
      attempts: UIntTC,
      repeat: 'RepeatOptionsUnion',
      backoff: 'Int', // | TODO: BackoffOptions
      lifo: 'Boolean',
      timeout: UIntTC,
      jobId: 'String',
      removeOnComplete: BoolOrUIntTC,
      removeOnFail: BoolOrUIntTC,
      stackTraceLimit: UIntTC,
    },
  });

  schemaComposer.createObjectTC({
    name: 'JobLogs',
    fields: {
      count: UIntNonNullTC,
      logs: '[String!]!',
    },
  });

  const JobTC = schemaComposer.createObjectTC({
    name: 'Job',
    fields: {
      id: 'String!',
      name: 'String!',
      data: 'JSON!',
      opts: 'JobOptions!',
      progress: UIntNonNullTC,
      delay: UIntNonNullTC,
      timestamp: 'Date!',
      attemptsMade: UIntTC,
      failedReason: 'JSON',
      stacktrace: '[String!]',
      returnvalue: 'JSON',
      finishedOn: 'Date',
      processedOn: 'Date',
      state: {
        type: StatusEnumTC,
        resolve: async (job) => {
          return await job.getState();
        },
      },
      logs: {
        type: 'JobLogs',
        resolve: async (job) => {
          return await job.queue.getJobLogs(job.id);
        },
      },
    },
  });

  schemaComposer.createObjectTC({
    name: 'JobCounts',
    fields: {
      active: UIntNonNullTC,
      completed: UIntNonNullTC,
      failed: UIntNonNullTC,
      delayed: UIntNonNullTC,
      waiting: UIntNonNullTC,
    },
  });

  schemaComposer.createObjectTC({
    name: 'RepeatableJobInformation',
    fields: {
      key: 'String!',
      name: 'String!',
      id: 'String',
      endDate: 'Date',
      tz: 'String',
      cron: 'String!',
      //every: 'Date', //TODO: вроде как должен быть обязательным, проверить - нет в бул-4
      next: 'Date!',
    },
  });

  const startInput = {
    type: 'Int',
    defaultValue: 0,
  };

  const endInput = {
    type: 'Int',
    defaultValue: -1,
  };

  const types = ['completed', 'failed', 'delayed', 'repeat', 'active', 'waiting', 'paused'];

  const QueueTC = schemaComposer.createObjectTC({
    name: 'Queue',
    description: 'Bull queue',
    fields: {
      hostId: 'String!',
      name: 'String!',
      jobNames: '[String!]!',
      jobCounts: {
        type: 'JobCounts',
        resolve: async (Queue) => {
          const asd = await Queue.getJobCounts(...types);
          console.log(asd);
          return await Queue.getJobCounts(...types);
        },
      },
      repeatables: {
        type: '[RepeatableJobInformation!]!',
        resolve: async (Queue) => {
          return await Queue.getRepeatableJobs();
        },
      },
      jobs: {
        type: '[Job!]!',
        args: {
          status: StatusEnumTC.getTypeNonNull(),
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { status, start, end }) => {
          return await Queue.getJobs([status], start, end, false); //TODO: пагинацию
        },
      },
      waitingJobs: {
        type: '[Job!]!',
        args: {
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { start, end }) => {
          return await Queue.getWaiting(start, end); //TODO: пагинацию
        },
      },
      completedJobs: {
        type: '[Job!]!',
        args: {
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { start, end }) => {
          return await Queue.getCompleted(start, end); //TODO: пагинацию
        },
      },
      activeJobs: {
        type: '[Job!]!',
        args: {
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { start, end }) => {
          return await Queue.getActive(start, end); //TODO: пагинацию
        },
      },
      delayedJobs: {
        type: '[Job!]!',
        args: {
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { start, end }) => {
          return await Queue.getDelayed(start, end); //TODO: пагинацию
        },
      },
      failedJobs: {
        type: '[Job!]!',
        args: {
          start: startInput,
          end: endInput,
        },
        resolve: async (Queue, { start, end }) => {
          return await Queue.getFailed(start, end); //TODO: пагинацию
        },
      },
    },
  });

  return {
    CronRepeatOptionsTC,
    JobOptionsTC,
    JobTC,
    QueueTC,
  };
}
