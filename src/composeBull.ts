import {
  schemaComposer,
  SchemaComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
} from 'graphql-compose';
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
import { wrapMutationFC, wrapQueueArgs } from './helpers';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  type FC = ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;

  type Middleare = (fc: FC, sc: SchemaComposer<any>, opts: Options) => FC;

  type Creator = (sc: SchemaComposer<any>, opts: Options) => FC;

  type Wrapper = (creator: Creator) => FC;

  type ComposeFCResult = (...args: Middleare[]) => Wrapper;

  type ComposeFC = (sc: SchemaComposer<any>, opts: Options) => ComposeFCResult;

  /**
   * Compose several FC creator with middlewares
   *  Eg. composeFC(sc, opts)(createQueueKeysFC, wrapQueueArgs, wrapOtherMiddleware)
   *  Will work like the following code:
   *    let fc = createQueueKeysFC(sc, opts);
   *    fc = wrapQueueArgs(fc, sc, opts)
   *    fc = wrapOtherMiddleware(fc, sc, opts)
   *    return fc;
   */
  function composeFC(sc: SchemaComposer<any>, opts: Options): ComposeFCResult {
    return (...middlewares: Middleare[]): Wrapper => (creator: Creator): FC => {
      let fc = creator(sc, opts);
      for (let i = 0; i < middlewares.length; i++) {
        fc = middlewares[i](fc, sc, opts);
      }
      return fc;
    };
  }

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
