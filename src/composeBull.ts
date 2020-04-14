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
import { wrapMutationFC, wrapQueueArgs, composeFC } from './helpers';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  const wrapQuery = composeFC(sc, opts)(wrapQueueArgs);
  const wrapMutation = composeFC(sc, opts)(wrapMutationFC, wrapQueueArgs);

  return {
    QueueTC: getQueueTC(sc, opts),
    JobTC: getJobTC(sc, opts),
    queryFields: {
      queueKeys: wrapQuery(createQueueKeysFC),
      queues: wrapQuery(createQueuesFC),
      queue: wrapQuery(createQueueFC),
      job: wrapQuery(createJobFC),
    },
    mutationFields: {
      queueClean: wrapMutation(createQueueCleanFC),
      queueDrain: wrapMutation(createQueueDrainFC),
      queuePause: wrapMutation(createQueuePauseFC),
      queueResume: wrapMutation(createQueueResumeFC),
      queueRemoveRepeatable: wrapMutation(createRemoveRepeatableFC),
      jobAdd: wrapMutation(createJobAddFC),
      jobAddBulk: wrapMutation(createJobAddBulkFC),
      jobAddRepeatableCron: wrapMutation(createJobAddCronFC),
      jobAddRepeatableEvery: wrapMutation(createJobAddEveryFC),
      jobDiscard: wrapMutation(createJobDiscardFC),
      jobPromote: wrapMutation(createjobPromoteFC),
      jobRemove: wrapMutation(createJobRremoveFC),
      jobRetry: wrapMutation(createJobRetryFC),
      jobUpdate: wrapMutation(createJobUpdateFC),
      jobLogAdd: wrapMutation(createJobLogAddFC),
    },
  };
}
