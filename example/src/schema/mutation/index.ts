import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { createQueueCleanFC } from './queueClean';
import { createQueueDrainFC } from './queueDrain';
import { createQueuePauseFC } from './queuePause';
import { createQueueResumeFC } from './queueResume';

import { createRemoveRepeatableFC } from './queueRemoveRepeatable';

import { createJobAddFC } from './jobAdd';
import { createJobAddRepeatableCronFC } from './jobAdd';
import { createJobAddRepeatableEveryFC } from './jobAdd';
import { createJobDiscardFC } from './jobDiscard';
import { createjobPromoteFC } from './jobPromote';
import { createJobRremoveFC } from './jobRemove';
import { createJobRetryFC } from './jobRetry';
import { createJobUpdateFC } from './jobUpdate';
import { createJobLogAddFC } from './jobLogAdd';

import { createGenerateHelper } from './helpers/wrapMutationFC';

export function createMutationFields({
  schemaComposer,
}: {
  schemaComposer: SchemaComposer<any>;
}): any {
  const generateHelper = createGenerateHelper(schemaComposer);

  function generateWrappedFC(
    createFC: (sc: SchemaComposer<any>) => ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>
  ) {
    return generateHelper(createFC(schemaComposer));
  }

  return {
    queueClean: generateWrappedFC(createQueueCleanFC),
    queueDrain: generateWrappedFC(createQueueDrainFC),
    queuePause: generateWrappedFC(createQueuePauseFC),
    queueResume: generateWrappedFC(createQueueResumeFC),
    queueRemoveRepeatable: generateWrappedFC(createRemoveRepeatableFC),

    jobAdd: generateWrappedFC(createJobAddFC),
    jobAddRepeatableCron: generateWrappedFC(createJobAddRepeatableCronFC),
    jobAddRepeatableEvery: generateWrappedFC(createJobAddRepeatableEveryFC),

    jobDiscard: generateWrappedFC(createJobDiscardFC),
    jobPromote: generateWrappedFC(createjobPromoteFC),
    jobRemove: generateWrappedFC(createJobRremoveFC),
    jobRetry: generateWrappedFC(createJobRetryFC),
    jobUpdate: generateWrappedFC(createJobUpdateFC),
    jobLogAdd: generateWrappedFC(createJobLogAddFC),
  };
}
