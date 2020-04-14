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
import { createMutationFC, predefineQueueArgs } from './helpers';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  return {
    QueueTC: getQueueTC(sc, opts),
    JobTC: getJobTC(sc, opts),
    queryFields: {
      queueKeys: predefineQueueArgs(createQueueKeysFC(sc, opts), opts),
      queues: predefineQueueArgs(createQueuesFC(sc, opts), opts),
      queue: predefineQueueArgs(createQueueFC(sc, opts), opts),
      job: predefineQueueArgs(createJobFC(sc, opts), opts),
    },
    mutationFields: {
      queueClean: predefineQueueArgs(createMutationFC(createQueueCleanFC, sc, opts), opts),
      queueDrain: predefineQueueArgs(createMutationFC(createQueueDrainFC, sc, opts), opts),
      queuePause: predefineQueueArgs(createMutationFC(createQueuePauseFC, sc, opts), opts),
      queueResume: predefineQueueArgs(createMutationFC(createQueueResumeFC, sc, opts), opts),
      queueRemoveRepeatable: predefineQueueArgs(
        createMutationFC(createRemoveRepeatableFC, sc, opts),
        opts
      ),
      jobAdd: predefineQueueArgs(createMutationFC(createJobAddFC, sc, opts), opts),
      jobAddBulk: predefineQueueArgs(createMutationFC(createJobAddBulkFC, sc, opts), opts),
      jobAddRepeatableCron: predefineQueueArgs(
        createMutationFC(createJobAddCronFC, sc, opts),
        opts
      ),
      jobAddRepeatableEvery: predefineQueueArgs(
        createMutationFC(createJobAddEveryFC, sc, opts),
        opts
      ),
      jobDiscard: predefineQueueArgs(createMutationFC(createJobDiscardFC, sc, opts), opts),
      jobPromote: predefineQueueArgs(createMutationFC(createjobPromoteFC, sc, opts), opts),
      jobRemove: predefineQueueArgs(createMutationFC(createJobRremoveFC, sc, opts), opts),
      jobRetry: predefineQueueArgs(createMutationFC(createJobRetryFC, sc, opts), opts),
      jobUpdate: predefineQueueArgs(createMutationFC(createJobUpdateFC, sc, opts), opts),
      jobLogAdd: predefineQueueArgs(createMutationFC(createJobLogAddFC, sc, opts), opts),
    },
  };
}
