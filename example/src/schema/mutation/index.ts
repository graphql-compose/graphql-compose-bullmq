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

export function createMutationFields({
  schemaComposer,
  JobTC,
  JobStatusEnumTC,
  JobOptionsInputTC,
}): any {
  const generateHelper = createGenerateHelper(schemaComposer);
  //TODO: пропустить через map это
  return {
    queueClean: generateHelper(createQueueCleanFC({ schemaComposer, JobStatusEnumTC })),
    queuePause: generateHelper(createQueuePauseFC()),
    queueResume: generateHelper(createQueueResumeFC()),
    queueRemoveRepeatable: generateHelper(createRemoveRepeatableFC()),
    jobAdd: generateHelper(createJobAddFC({ JobTC, JobOptionsInputTC })),
    jobDiscard: generateHelper(createJobDiscardFC({ JobStatusEnumTC })),
    jobPromote: generateHelper(createjobPromoteFC({ JobStatusEnumTC })),
    jobRemove: generateHelper(createJobRremoveFC({ JobTC })),
    jobRetry: generateHelper(createJobRetryFC({ JobStatusEnumTC })),
    jobUpdate: generateHelper(createJobUpdateFC({ JobTC })),
    jobLogAdd: generateHelper(createJobLogAddFC({ JobStatusEnumTC })),
  };
}
