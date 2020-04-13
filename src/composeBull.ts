import { schemaComposer, SchemaComposer } from 'graphql-compose';
import { Options } from './definitions';
import { getQueueTC, getJobTC } from './types';
import { createQueuesFC, createQueueKeysFC, createQueueFC, createJobFC } from './query';
import {
  createQueueCleanFC,
  createQueueDrainFC,
  createQueuePauseFC,
  createQueueResumeFC,
  createRemoveRepeatableFC,
  createJobAddFC,
  createJobAddBulkFC,
  createJobAddCronFC,
  createJobAddEveryFC,
  createJobDiscardFC,
  createjobPromoteFC,
  createJobRremoveFC,
  createJobRetryFC,
  createJobUpdateFC,
  createJobLogAddFC,
} from './mutation';
import { createMutationFC } from './helpers/wrapMutationFC';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  return {
    QueueTC: getQueueTC(sc, opts),
    JobTC: getJobTC(sc, opts),
    queryFields: {
      queueKeys: createQueueKeysFC(sc, opts),
      queues: createQueuesFC(sc, opts),
      queue: createQueueFC(sc, opts),
      job: createJobFC(sc, opts),
    },
    mutationFields: {
      queueClean: createMutationFC(createQueueCleanFC, sc, opts),
      queueDrain: createMutationFC(createQueueDrainFC, sc, opts),
      queuePause: createMutationFC(createQueuePauseFC, sc, opts),
      queueResume: createMutationFC(createQueueResumeFC, sc, opts),
      queueRemoveRepeatable: createMutationFC(createRemoveRepeatableFC, sc, opts),
      jobAdd: createMutationFC(createJobAddFC, sc, opts),
      jobAddBulk: createMutationFC(createJobAddBulkFC, sc, opts),
      jobAddRepeatableCron: createMutationFC(createJobAddCronFC, sc, opts),
      jobAddRepeatableEvery: createMutationFC(createJobAddEveryFC, sc, opts),
      jobDiscard: createMutationFC(createJobDiscardFC, sc, opts),
      jobPromote: createMutationFC(createjobPromoteFC, sc, opts),
      jobRemove: createMutationFC(createJobRremoveFC, sc, opts),
      jobRetry: createMutationFC(createJobRetryFC, sc, opts),
      jobUpdate: createMutationFC(createJobUpdateFC, sc, opts),
      jobLogAdd: createMutationFC(createJobLogAddFC, sc, opts),
    },
  };
}
