// import queueClean from './queueClean';
// import queuePause from './queuePause';
// import queueResume from './queueResume';

// import queueRemoveRepeatable from './queueRemoveRepeatable';

import { createJobAddFC } from './jobAdd';
import { createJobDiscardFC } from './jobDiscard';
// import jobPromote from './jobPromote';
import { createJobRremoveFC } from './jobRemove';
// import jobRetry from './jobRetry';
// import jobUpdate from './jobUpdate';
// import jobLogAdd from './jobLogAdd';

export function createMutationFields({ schemaComposer, JobTC, JobOptionsInputTC }): any {
  return {
    // queueClean: queueClean({ schemaComposer }),
    // queuePause: queuePause({ schemaComposer }),
    // queueResume: queueResume({ schemaComposer }),
    // queueRemoveRepeatable: queueRemoveRepeatable({ schemaComposer }),
    jobAdd: createJobAddFC({ schemaComposer, JobTC, JobOptionsInputTC }),
    jobDiscard: createJobDiscardFC({ schemaComposer }),
    // jobPromote: jobPromote({ schemaComposer }),
    jobRemove: createJobRremoveFC({ schemaComposer, JobTC }),
    // jobRetry: jobRetry({ schemaComposer }),
    // jobUpdate: jobUpdate({ schemaComposer, JobTC }),
    // jobLogAdd: jobLogAdd({ schemaComposer }),
  };
}
