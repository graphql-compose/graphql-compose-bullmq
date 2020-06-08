import { schemaComposer, SchemaComposer } from 'graphql-compose';
import { Options } from './definitions';
import { getQueueTC, getJobTC } from './types';
import {
  createQueuesFC,
  createQueueKeysFC,
  createQueueFC,
  createJobFC,
  createInfoFC,
} from './query';
import {
  createQueueCleanFC,
  createQueueDrainFC,
  createQueuePauseFC,
  createQueueResumeFC,
  createRemoveRepeatableFC,
  createQueueDeleteFC,
  createJobAddFC,
  createJobAddBulkFC,
  createJobAddCronFC,
  createJobAddEveryFC,
  createJobDiscardFC,
  createjobPromoteFC,
  createJobRremoveFC,
  createJobRremoveBulkFC,
  createJobRetryFC,
  createJobUpdateFC,
  createJobLogAddFC,
  createJobMoveToDelayedFC,
  createQueuePepUpFC,
} from './mutation';
import { createJobAddSubFC } from './subscriptions';
import { wrapMutationFC, wrapQueueArgs, wrapQueueSubsArgs, composeFC } from './helpers';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  const wrapQuery = composeFC(sc, opts)(wrapQueueArgs);
  const wrapMutation = composeFC(sc, opts)(wrapMutationFC, wrapQueueArgs);
  const wrapSubscription = composeFC(sc, opts)(wrapQueueSubsArgs);

  return {
    QueueTC: getQueueTC(sc, opts),
    JobTC: getJobTC(sc, opts),
    queryFields: {
      queueKeys: wrapQuery(createQueueKeysFC),
      queues: wrapQuery(createQueuesFC),
      queue: wrapQuery(createQueueFC),
      job: wrapQuery(createJobFC),
      info: wrapQuery(createInfoFC),
    },
    mutationFields: {
      queueClean: wrapMutation(createQueueCleanFC),
      queueDrain: wrapMutation(createQueueDrainFC),
      queuePause: wrapMutation(createQueuePauseFC),
      queueResume: wrapMutation(createQueueResumeFC),
      queueRemoveRepeatable: wrapMutation(createRemoveRepeatableFC),
      queueDelete: wrapMutation(createQueueDeleteFC),
      jobAdd: wrapMutation(createJobAddFC),
      jobAddBulk: wrapMutation(createJobAddBulkFC),
      jobAddRepeatableCron: wrapMutation(createJobAddCronFC),
      jobAddRepeatableEvery: wrapMutation(createJobAddEveryFC),
      jobDiscard: wrapMutation(createJobDiscardFC),
      jobPromote: wrapMutation(createjobPromoteFC),
      jobRemove: wrapMutation(createJobRremoveFC),
      jobRemoveBulk: wrapMutation(createJobRremoveBulkFC),
      jobRetry: wrapMutation(createJobRetryFC),
      jobUpdate: wrapMutation(createJobUpdateFC),
      jobLogAdd: wrapMutation(createJobLogAddFC),
      jobMoveToDelayed: wrapMutation(createJobMoveToDelayedFC),
      queuePepUp: wrapMutation(createQueuePepUpFC),
    },
    subscriptionFields: {
      jobAddSub: wrapSubscription(createJobAddSubFC),
    },
  };
}
