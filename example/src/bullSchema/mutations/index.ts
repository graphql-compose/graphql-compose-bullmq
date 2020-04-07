import queueClean from './queueClean';
import queuePause from './queuePause';
import queueResume from './queueResume';

import queueRemoveRepeatable from './queueRemoveRepeatable';

import jobAdd from './jobAdd';
import jobDiscard from './jobDiscard';
import jobPromote from './jobPromote';
import jobRemove from './jobRemove';
import jobRetry from './jobRetry';
import jobUpdate from './jobUpdate';
import jobLogAdd from './jobLogAdd';

export default function createMutations({ schemaComposer, JobTC, JobOptionsInputTC }) {
  return {
    queueClean: queueClean({ schemaComposer }),
    queuePause: queuePause({ schemaComposer }),
    queueResume: queueResume({ schemaComposer }),
    queueRemoveRepeatable: queueRemoveRepeatable({ schemaComposer }),
    jobAdd: jobAdd({ schemaComposer, JobTC, JobOptionsInputTC }),
    jobDiscard: jobDiscard({ schemaComposer }),
    jobPromote: jobPromote({ schemaComposer }),
    jobRemove: jobRemove({ schemaComposer, JobTC }),
    jobRetry: jobRetry({ schemaComposer }),
    jobUpdate: jobUpdate({ schemaComposer, JobTC }),
    jobLogAdd: jobLogAdd({ schemaComposer }),
  };
}
