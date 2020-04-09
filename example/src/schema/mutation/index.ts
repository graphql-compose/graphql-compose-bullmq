import { createQueueCleanFC } from './queueClean';
import { createQueuePauseFC } from './queuePause';
import { createQueueResumeFC } from './queueResume';

import { createRemoveRepeatableFC } from './queueRemoveRepeatable';

import { createJobAddFC } from './jobAdd';
import { createJobDiscardFC } from './jobDiscard';
import { createjobPromoteFC } from './jobPromote';
import { createJobRremoveFC } from './jobRemove';
import { createJobRetryFC } from './jobRetry';
import { createJobUpdateFC } from './jobUpdate';
import { createJobLogAddFC } from './jobLogAdd';

import { createGenerateHelper } from './_helpers';

export function createMutationFields({ schemaComposer }): any {
  const generateHelper = createGenerateHelper(schemaComposer);
  //TODO: пропустить через map это
  return {
    queueClean: generateHelper(createQueueCleanFC({ schemaComposer })),
    queuePause: generateHelper(createQueuePauseFC()),
    queueResume: generateHelper(createQueueResumeFC()),
    queueRemoveRepeatable: generateHelper(createRemoveRepeatableFC()),
    jobAdd: generateHelper(createJobAddFC(schemaComposer)),
    jobDiscard: generateHelper(createJobDiscardFC({ schemaComposer })),
    jobPromote: generateHelper(createjobPromoteFC({ schemaComposer })),
    jobRemove: generateHelper(createJobRremoveFC(schemaComposer)),
    jobRetry: generateHelper(createJobRetryFC({ schemaComposer })),
    jobUpdate: generateHelper(createJobUpdateFC(schemaComposer)),
    jobLogAdd: generateHelper(createJobLogAddFC({ schemaComposer })),
  };
}
