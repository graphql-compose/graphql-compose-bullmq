import { schemaComposer } from 'graphql-compose';
import createTypes from './gqlTypes';
import createQueries from './queries';
import createMutations from './mutations';

const { JobTC, QueueTC, JobOptionsInputTC } = createTypes({ schemaComposer });

const { queues, queue, job } = createQueries({
  schemaComposer,
  QueueTC,
  JobTC,
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
