import {
  schemaComposer,
  SchemaComposer,
  ObjectTypeComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
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
import {
  createOnJobActiveFC,
  createOnJobCompletedFC,
  createOnJobDelayedFC,
  createOnJobFailedFC,
  createOnJobProgressFC,
  createOnJobRemovedFC,
  createOnJobStalledFC,
  createOnJobWaitingFC,
  createOnQueuePausedFC,
  createOnQueueResumedFC,
} from './subscriptions';
import { wrapMutationFC, wrapQueueArgs, wrapQueueSubsArgs, composeFC } from './helpers';

interface ComposeBullResult {
  QueueTC: ObjectTypeComposer;
  JobTC: ObjectTypeComposer;
  queryFields: Record<string, ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>>;
  mutationFields: Record<string, ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>>;
  subscriptionFields?: Record<string, ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>>;
}

export function composeBull(
  opts: Options & { schemaComposer?: SchemaComposer<any> }
): ComposeBullResult {
  const sc = opts?.schemaComposer || schemaComposer;

  const wrapQuery = composeFC(sc, opts)(wrapQueueArgs);
  const wrapMutation = composeFC(sc, opts)(wrapMutationFC, wrapQueueArgs);
  const wrapSubscription = composeFC(sc, opts)(wrapQueueSubsArgs);

  const data: ComposeBullResult = {
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
      onJobActive: wrapSubscription(createOnJobActiveFC),
      onJobCompleted: wrapSubscription(createOnJobCompletedFC),
      onJobDelayed: wrapSubscription(createOnJobDelayedFC),
      onJobFailed: wrapSubscription(createOnJobFailedFC),
      onJobProgress: wrapSubscription(createOnJobProgressFC),
      onJobRemoved: wrapSubscription(createOnJobRemovedFC),
      onJobStalled: wrapSubscription(createOnJobStalledFC),
      onJobWaiting: wrapSubscription(createOnJobWaitingFC),
      onQueuePaused: wrapSubscription(createOnQueuePausedFC),
      onQueueResumed: wrapSubscription(createOnQueueResumedFC),
    },
  };

  return data;
}
