import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { createQueueCleanFC } from './queueClean';
import { createQueueDrainFC } from './queueDrain';
import { createQueuePauseFC } from './queuePause';
import { createQueueResumeFC } from './queueResume';

import { createRemoveRepeatableFC } from './queueRemoveRepeatable';

import { createJobAddFC } from './jobAdd';
import { createJobAddBulkFC } from './jobAddBulk';
import { createJobAddCronFC } from './jobAddCron';
import { createJobAddEveryFC } from './jobAddEvery';
import { createJobDiscardFC } from './jobDiscard';
import { createjobPromoteFC } from './jobPromote';
import { createJobRremoveFC } from './jobRemove';
import { createJobRetryFC } from './jobRetry';
import { createJobUpdateFC } from './jobUpdate';
import { createJobLogAddFC } from './jobLogAdd';

import { createGenerateHelper } from './helpers/wrapMutationFC';
import { Options } from '../definitions';

export function createMutationFields(schemaComposer: SchemaComposer<any>, opts: Options) {
  const generateHelper = createGenerateHelper(schemaComposer, opts);

  function generateWrappedFC(
    createFC: (
      sc: SchemaComposer<any>,
      opts: Options
    ) => ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>
  ) {
    return generateHelper(createFC(schemaComposer, opts));
  }

  return {
    queueClean: generateWrappedFC(createQueueCleanFC),
    queueDrain: generateWrappedFC(createQueueDrainFC),
    queuePause: generateWrappedFC(createQueuePauseFC),
    queueResume: generateWrappedFC(createQueueResumeFC),
    queueRemoveRepeatable: generateWrappedFC(createRemoveRepeatableFC),

    jobAdd: generateWrappedFC(createJobAddFC),
    jobAddBulk: generateWrappedFC(createJobAddBulkFC),
    jobAddRepeatableCron: generateWrappedFC(createJobAddCronFC),
    jobAddRepeatableEvery: generateWrappedFC(createJobAddEveryFC),

    jobDiscard: generateWrappedFC(createJobDiscardFC),
    jobPromote: generateWrappedFC(createjobPromoteFC),
    jobRemove: generateWrappedFC(createJobRremoveFC),
    jobRetry: generateWrappedFC(createJobRetryFC),
    jobUpdate: generateWrappedFC(createJobUpdateFC),
    jobLogAdd: generateWrappedFC(createJobLogAddFC),
  };
}
