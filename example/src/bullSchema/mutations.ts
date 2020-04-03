import { PayloadStatusEnum, ErrorCodeEnum, StatusEnum } from './gqlTypes/enums';
import { MutationsDependencies, Mutations, Context } from '../declarations';

export default function ({
  schemaComposer,
  QueueTC,
  JobTC,
  JobOptionsInputTC,
}: MutationsDependencies) {
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

  function queueNotFound(name) {
    return {
      name,
      status: PayloadStatusEnum.ERROR,
      errorCode: ErrorCodeEnum.QUEUE_NOT_FOUND,
      error: 'Queue not found!',
    };
  }

  function jobNotFound(name, id) {
    return {
      name,
      id,
      status: PayloadStatusEnum.ERROR,
      errorCode: ErrorCodeEnum.JOB_NOT_FOUND,
      error: 'Job by id not found!',
    };
  }

  const JobActionPayloadTC = schemaComposer.createObjectTC({
    name: 'JobActionPayload',
    fields: {
      status: 'PayloadStatusEnum!',
      error: 'String',
      errorCode: 'ErrorCodeEnum',
      name: 'String!',
      id: 'String',
      state: 'StatusEnum',
    },
  });

  return {
    queueClean: {
      type: schemaComposer.createObjectTC({
        name: 'QueueCleanPayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
          jobs: '[String!]',
        },
      }),
      args: {
        name: 'String!',
        filter: schemaComposer
          .createInputTC({
            name: 'QueueCleanFilter',
            fields: {
              grace: 'UInt!',
              status: {
                type: 'StatusEnum',
                defaultValue: 'completed',
              },
              limit: {
                //TODO: дочитать умолчания для скалярных типов
                type: 'UInt',
                defaultValue: 0,
              },
            },
          })
          .getTypeNonNull(),
      },
      resolve: async (_, { name, filter: { grace, status, limit } }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const jobs = await Queues.get(name).clean(grace, limit, status);
        return {
          name,
          status: PayloadStatusEnum.OK,
          jobs,
        };
      },
    },
    queuePause: {
      type: schemaComposer.createObjectTC({
        name: 'QueuePausePayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
        },
      }),
      args: {
        name: 'String!',
      },
      resolve: async (_, { name }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        await Queues.get(name).pause();
        return {
          name,
          status: PayloadStatusEnum.OK,
        };
      },
    },
    queueResume: {
      type: schemaComposer.createObjectTC({
        name: 'QueueResumePayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
        },
      }),
      args: {
        name: 'String!',
      },
      resolve: async (_, { name }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        await Queues.get(name).resume();
        return {
          name,
          status: PayloadStatusEnum.OK,
        };
      },
    },
    jobRetry: {
      type: JobActionPayloadTC,
      args: {
        name: 'String!',
        id: 'String!',
      },
      resolve: async (_, { name, id }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        let job = await Queues.get(name).getJob(id);
        if (!job) return jobNotFound(name, id);

        await job.retry();
        return {
          status: PayloadStatusEnum.OK,
          name,
          id,
          state: StatusEnum.ACTIVE,
        };
      },
    },
    jobUpdate: {
      type: schemaComposer.createObjectTC({
        name: 'JobRetryPayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
          job: JobTC,
        },
      }),
      args: {
        name: 'String!',
        id: 'String!',
        data: 'JSON!',
      },
      resolve: async (_, { name, id, data }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        let job = await Queue.getJob(id);
        if (!job) return jobNotFound(name, id);

        await job.update(data); //Данные заменяются полностью
        job = await Queue.getJob(job.id); //TODO: может и не надо заново читать
        return {
          status: PayloadStatusEnum.OK,
          name,
          job,
        };
      },
    },
    jobRemove: {
      type: schemaComposer.createObjectTC({
        name: 'JobRemovePayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
          id: 'String',
        },
      }),
      args: {
        name: 'String!',
        id: 'String!',
      },
      resolve: async (_, { name, id }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        let job = await Queue.getJob(id);
        if (!job) return jobNotFound(name, id);

        await job.remove();
        return {
          status: PayloadStatusEnum.OK,
          name,
          id,
        };
      },
    },
    jobAdd: {
      type: schemaComposer.createObjectTC({
        name: 'JobAddPayload',
        fields: {
          status: 'PayloadStatusEnum!',
          error: 'String',
          errorCode: 'ErrorCodeEnum',
          name: 'String!',
          job: JobTC,
        },
      }),
      args: {
        name: 'String!',
        jobName: 'String!',
        data: 'JSON!',
        options: JobOptionsInputTC,
      },
      resolve: async (_, { name, jobName, data, options }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        const job = await Queue.add(jobName, data, options);
        return {
          status: PayloadStatusEnum.OK,
          name,
          job,
        };
      },
    },
    jobDiscard: {
      //TODO: дочитать док.
      type: JobActionPayloadTC,
      args: {
        name: 'String!',
        id: 'String!',
      },
      resolve: async (_, { name, id }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        let job = await Queue.getJob(id);
        if (!job) return jobNotFound(name, id);
        await job.discard();
        return {
          status: PayloadStatusEnum.OK,
          name,
          id,
          state: await job.getState(),
        };
      },
    },
    jobPromote: {
      type: JobActionPayloadTC,
      args: {
        name: 'String!',
        id: 'String!',
      },
      resolve: async (_, { name, id }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        let job = await Queue.getJob(id);
        if (!job) return jobNotFound(name, id);
        await job.promote();
        return {
          status: PayloadStatusEnum.OK,
          name,
          id,
          state: await job.getState(),
        };
      },
    },
    jobLog: {
      type: JobActionPayloadTC,
      args: {
        name: 'String!',
        id: 'String!',
        row: 'String!',
      },
      resolve: async (_, { name, id, row }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        const Queue = Queues.get(name);
        let job = await Queue.getJob(id);
        if (!job) return jobNotFound(name, id);
        const logRes = await job.log(row);
        //TODO: в logRes похоже тупо количество записей в логе, подумать что с этим сотворить...
        return {
          status: PayloadStatusEnum.OK,
          name,
          id,
          state: await job.getState(),
        };
      },
    },
    //TODO: подумать что вернуть и как стандартизировать ответы, какая в точности схема снятия с повтора?...:
    removeRepeatableByKey: {
      type: JobActionPayloadTC,
      args: {
        name: 'String!',
        key: 'String!',
      },
      resolve: async (_, { name, key }, { Queues }) => {
        if (!Queues.has(name)) return queueNotFound(name);
        await Queues.get(name).removeRepeatableByKey(key);
        //TODO: тут все благополучно, даже если нет ничего по ключу, надо проблему донести до юзера все-таки
        return {
          status: PayloadStatusEnum.OK,
        };
      },
    },
  };
}
