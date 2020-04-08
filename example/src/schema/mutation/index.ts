import queueClean from './queueClean';
import queuePause from './queuePause';
import queueResume from './queueResume';

import queueRemoveRepeatable from './queueRemoveRepeatable';

import { createJobAddFC } from './jobAdd';
import { createJobDiscardFC } from './jobDiscard';
import { createjobPromoteFC } from './jobPromote';
import { createJobRremoveFC } from './jobRemove';
import { createJobRetryFC } from './jobRetry';
import { createJobUpdateFC } from './jobUpdate';
import { createJobLogAddFC } from './jobLogAdd';

export function createMutationFields({ schemaComposer, JobTC, JobOptionsInputTC }): any {
  return {
    queueClean: queueClean({ schemaComposer }),
    queuePause: queuePause({ schemaComposer }),
    queueResume: queueResume({ schemaComposer }),
    queueRemoveRepeatable: queueRemoveRepeatable({ schemaComposer }),
    jobAdd: createJobAddFC({ schemaComposer, JobTC, JobOptionsInputTC }),
    jobDiscard: createJobDiscardFC({ schemaComposer }),
    jobPromote: createjobPromoteFC({ schemaComposer }),
    jobRemove: createJobRremoveFC({ schemaComposer, JobTC }),
    jobRetry: createJobRetryFC({ schemaComposer }),
    jobUpdate: createJobUpdateFC({ schemaComposer, JobTC }),
    jobLogAdd: createJobLogAddFC({ schemaComposer }),
  };
}
