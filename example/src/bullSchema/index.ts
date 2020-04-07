import { schemaComposer } from 'graphql-compose';
import createTypes from './gqlTypes';
import createQueries from './queries';
import createMutations from './mutations';

const { JobTC, QueueTC, JobOptionsInputTC } = createTypes({ schemaComposer });

const { queues, queue, job } = createQueries({
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
  jobLogAdd,
  jobDiscard,
  jobPromote,
  queueRemoveRepeatable,
} = createMutations({
  schemaComposer,
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
  jobLogAdd,
  jobDiscard,
  jobPromote,
  queueRemoveRepeatable,
});

export default schemaComposer.buildSchema();
