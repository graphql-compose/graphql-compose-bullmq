import { schemaComposer } from 'graphql-compose';
import { AuthenticationError } from 'apollo-server';
import createTypes from './types';
import createQueries from './queries';
import createMutations from './mutations';

const QueueNotFoundProblemTC = schemaComposer.createObjectTC({
  name: 'QueueNotFoundProblem',
  fields: {
    name: 'String!',
    message: 'String',
  },
});

const JobNotFoundProblemTC = schemaComposer.createObjectTC({
  name: 'JobNotFoundProblem',
  fields: {
    queueName: 'String!',
    id: 'String!',
    message: 'String',
  },
});

const UnknownJobNameProblemTC = schemaComposer.createObjectTC({
  name: 'UnknownJobNameProblem',
  fields: {
    queueName: 'String!',
    jobName: 'String!',
    message: 'String',
  },
});

const createQueueNotFoundProblem = (queueName) => ({
  type: QueueNotFoundProblemTC.getTypeName(),
  name: queueName,
  message: `Queue by name ${queueName} not found!`,
});

const createJobNotFoundProblem = (queueName, jobId) => ({
  type: JobNotFoundProblemTC.getTypeName(),
  queueName,
  id: jobId,
  message: `Job by id ${jobId} not found in queue ${queueName}!`,
});

const createUnknownJobNameProblem = (queueName, jobName) => ({
  type: UnknownJobNameProblemTC.getTypeName(),
  queueName,
  jobName,
  message: `Job by name ${jobName} not found in queue ${queueName}!`,
});

const runOnQueue = function (callback) {
  return async function (source, args, context) {
    const name = args.name || args.queueName;
    if (!name) {
      throw new Error('Queue name arg. required!');
    }
    if (!context.Queues.has(name)) {
      return createQueueNotFoundProblem(name);
    }
    const queue = context.Queues.get(name);
    return await callback(source, { queue, ...args }, context);
  };
};

const runOnJob = function (callback) {
  return async function (source, args, context) {
    const { queue, id } = args;
    if (!queue) {
      throw new Error('Queue arg. required!');
    }
    if (!id) {
      throw new Error('Job id arg. required!');
    }
    let job = await queue.bullQueue.getJob(id);
    if (!job) return createJobNotFoundProblem(queue.name, id);
    return await callback(source, { job, ...args }, context);
  };
};

const { StatusEnumTC, JobTC, QueueTC, JobOptionsInputTC } = createTypes({ schemaComposer });

const { queues, queue, job } = createQueries({
  schemaComposer,
  QueueTC,
  JobTC,
  runOnQueue,
  createJobNotFoundProblem,
  JobNotFoundProblemTC,
  QueueNotFoundProblemTC,
});

schemaComposer.Query.addFields({
  queues,
  queue,
  job,
});

const {
  queueClean,
  queuePause,
  queueResume,
  jobRetry,
  jobUpdate,
  jobRemove,
  jobAdd,
  jobLog,
  jobDiscard,
  jobPromote,
  removeRepeatableByKey,
} = createMutations({
  schemaComposer,
  QueueTC,
  JobTC,
  JobOptionsInputTC,
  StatusEnumTC,
  runOnQueue,
  runOnJob,
  createUnknownJobNameProblem,
  JobNotFoundProblemTC,
  UnknownJobNameProblemTC,
  QueueNotFoundProblemTC,
});

schemaComposer.Mutation.addFields({
  queueClean,
  queuePause,
  queueResume,
  jobRetry,
  jobUpdate,
  jobRemove,
  jobAdd,
  jobLog,
  jobDiscard,
  jobPromote,
  removeRepeatableByKey,
});

export default schemaComposer.buildSchema();
