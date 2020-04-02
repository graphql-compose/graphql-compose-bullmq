import { isObject } from './utils';

export default function ({
  schemaComposer,
  QueueTC,
  JobTC,
  JobOptionsInputTC,
  StatusEnumTC,
  runOnQueue,
  runOnJob,
  JobNotFoundProblemTC,
  UnknownJobNameProblemTC,
  QueueNotFoundProblemTC,
}) {
  // Job#progress - необходимо ли это снаружи?
  // Job#getState - есть просто получение очереди, там есть state
  // Job#discard - допонять
  // Job#promote - delayed -> waiting

  // Job#finished - подписка на финиш задания
  // Returns a promise that resolves to the returned data when the job has been finished.
  // TODO: Add a watchdog to check if the job has finished periodically.
  // since pubsub does not give any guarantees.

  // Job#moveToCompleted
  // Job#moveToFailed

  const JobStateInfoTC = schemaComposer.createObjectTC({
    name: 'JobStateInfo',
    fields: {
      queueName: 'String!',
      jobId: 'String!',
      state: 'String!',
      message: 'String',
    },
  });

  const CleanedJobsTC = schemaComposer.createObjectTC({
    name: 'CleanedJobs',
    fields: {
      queueName: 'String!',
      jobs: '[String!]!',
      status: 'String!', //Из какого сотояния удалили
      message: 'String',
    },
  });

  const QueuePausedTC = schemaComposer.createObjectTC({
    name: 'QueuePaused',
    fields: {
      name: 'String!',
      message: 'String',
    },
  });

  const QueueResumedTC = schemaComposer.createObjectTC({
    name: 'QueueResumed',
    fields: {
      name: 'String!',
      message: 'String',
    },
  });

  const RemoveRepeatableSuccessTC = schemaComposer.createObjectTC({
    name: 'RemoveRepeatableSuccess',
    fields: {
      //TODO:...
      message: 'String',
    },
  });

  function createUnion(item) {
    const types = [...item.problems, item.success];
    return schemaComposer.createUnionTC({
      name: item.name + 'Union',
      types,
      resolveType(result) {
        if (isObject(result)) {
          if (
            result.hasOwnProperty('type') &&
            types.some((tYpe) => tYpe.getTypeName() === result.type)
          ) {
            return result.type;
          }
          return (typeof item.test === 'function' && item.test(result)) || null;
        }
      },
    });
  }

  function testJob(result) {
    return isObject(result) && result.hasOwnProperty('id') && JobTC.getTypeName();
  }

  const Unions = [
    {
      name: 'JobActionResult',
      problems: [QueueNotFoundProblemTC, JobNotFoundProblemTC],
      success: JobStateInfoTC,
    },
    {
      name: 'JobAddResult',
      problems: [QueueNotFoundProblemTC, UnknownJobNameProblemTC],
      success: JobTC,
      test: testJob,
    },
    {
      name: 'JobUpdateResult',
      problems: [QueueNotFoundProblemTC, JobNotFoundProblemTC],
      success: JobTC,
      test: testJob,
    },
    {
      name: 'JobRemoveResult',
      problems: [QueueNotFoundProblemTC, JobNotFoundProblemTC],
      success: CleanedJobsTC,
    },
    {
      name: 'QueueCleanResult',
      problems: [QueueNotFoundProblemTC],
      success: CleanedJobsTC,
    },
    {
      name: 'QueuePausedResult',
      problems: [QueueNotFoundProblemTC],
      success: QueuePausedTC,
    },
    {
      name: 'QueueResumedResult',
      problems: [QueueNotFoundProblemTC],
      success: QueueResumedTC,
    },
    {
      name: 'RemoveRepeatableResult',
      problems: [QueueNotFoundProblemTC],
      success: RemoveRepeatableSuccessTC,
    },
  ].reduce((reducer, item) => {
    reducer[item.name] = createUnion(item);
    return reducer;
  }, {});

  return {
    queueClean: {
      type: Unions.QueueCleanResult,
      args: {
        name: 'String!',
        grace: 'UInt!',
        status: {
          type: StatusEnumTC,
          defaultValue: 'completed',
        },
        limit: {
          //TODO: дочитать умолчания для скалярных типов
          type: 'UInt',
          defaultValue: 0,
        },
      },
      resolve: runOnQueue(async (_, { queue, grace, limit, status }) => {
        const jobs = await queue.bullQueue.clean(grace, limit, status);
        return {
          type: CleanedJobsTC.getTypeName(),
          queueName: queue.name,
          jobs,
          status,
          message: 'Queue is cleaned!',
        };
      }),
    },
    queuePause: {
      type: Unions.QueuePausedResult,
      args: {
        name: 'String!',
      },
      resolve: runOnQueue(async (_, { queue }) => {
        await queue.bullQueue.pause();
        //TODO: как вытащить paused состояние, может быть вернуть количество остановленных заданий?
        return {
          type: QueuePausedTC.getTypeName(),
          name: queue.name,
          message: 'Paused!',
        };
      }),
    },
    queueResume: {
      type: Unions.QueueResumedResult,
      args: {
        name: 'String!',
      },
      resolve: runOnQueue(async (_, { queue }) => {
        await queue.bullQueue.resume();
        return {
          type: QueueResumedTC.getTypeName(),
          name: queue.name,
          message: 'Resumed!',
        };
      }),
    },
    jobMoveToCompleted: {},
    jobMoveToFailed: {},
    jobRetry: {
      type: Unions.JobActionResult,
      args: {
        queueName: 'String!',
        id: 'String!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job }) => {
          await job.retry();
          return {
            type: JobStateInfoTC.getTypeName(),
            queueName: queue.name,
            jobId: job.id,
            state: 'active',
            message: 'Job move to active for retry!',
          };
        })
      ),
    },
    jobUpdate: {
      type: Unions.JobUpdateResult,
      args: {
        queueName: 'String!',
        id: 'String!',
        data: 'JSON!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job, data }) => {
          await job.update(data); //Данные заменяются полностью
          job = await queue.bullQueue.getJob(job.id); //TODO: может и не надо заново читать
          return job;
        })
      ),
    },
    jobRemove: {
      type: Unions.JobRemoveResult,
      args: {
        queueName: 'String!',
        id: 'String!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job }) => {
          const status = job.getState();
          await job.remove();
          return {
            type: CleanedJobsTC.getTypeName(),
            queueName: queue.name,
            jobs: [job.id],
            status,
            message: 'Job removed!',
          };
        })
      ),
    },
    jobAdd: {
      type: Unions.JobAddResult,
      args: {
        queueName: 'String!',
        jobName: 'String!',
        data: 'JSON!',
        options: JobOptionsInputTC,
        status: StatusEnumTC,
      },
      resolve: runOnQueue(async (_, { queue, jobName, data, options, status }) => {
        if (!queue.jobNames.includes(jobName))
          return createUnknownJobNameProblem(queue.name, jobName);
        return await queue.bullQueue.add(jobName, data, options);
      }),
    },
    jobDiscard: {
      //TODO: дочитать док.
      type: Unions.JobActionResult,
      args: {
        queueName: 'String!',
        id: 'String!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job }) => {
          await job.discard();
          return {
            type: JobStateInfoTC.getTypeName(),
            queueName: queue.name,
            jobId: job.id,
            state: await job.getState(),
            message: 'Job is never ran again!',
          };
        })
      ),
    },
    jobPromote: {
      type: Unions.JobActionResult,
      args: {
        queueName: 'String!',
        id: 'String!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job }) => {
          await job.promote();
          return {
            type: JobStateInfoTC.getTypeName(),
            queueName: queue.name,
            jobId: job.id,
            state: await job.getState(),
            message: 'Job promoted!',
          };
        })
      ),
    },
    jobLog: {
      type: Unions.JobActionResult,
      args: {
        queueName: 'String!',
        id: 'String!',
        row: 'String!',
      },
      resolve: runOnQueue(
        runOnJob(async (_, { queue, job, row }) => {
          const logRes = await job.log(row);
          //TODO: в logRes похоже тупо количество записей в логе, подумать что с этим сотворить...
          return {
            type: JobStateInfoTC.getTypeName(),
            queueName: queue.name,
            jobId: job.id,
            state: await job.getState(),
            message: 'Job logged, count=' + logRes + '!',
          };
        })
      ),
    },
    removeRepeatableByKey: {
      //TODO: подумать что вернуть и как стандартизировать ответы, какая в точности схема снятия с повтора?...:
      type: Unions.RemoveRepeatableResult,
      args: {
        queueName: 'String!',
        key: 'String!',
      },
      resolve: runOnQueue(async (_, { queue, key }) => {
        await queue.bullQueue.removeRepeatableByKey(key);
        //TODO: тут все благополучно, даже если нет ничего по ключу, надо проблему донести до юзера все-таки
        return {
          type: RemoveRepeatableSuccessTC.getTypeName(),
          message: `Repeatable job by key=${key} removed!`,
        };
      }),
    },
  };
}
