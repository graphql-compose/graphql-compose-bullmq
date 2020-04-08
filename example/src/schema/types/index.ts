import { createEnumsTC } from './enums';
import { createInputTypes } from './input';
import { createQueueTC } from './queue';
import { createJobTC } from './job';

export default function ({ schemaComposer }) {
  const { JobStatusEnumTC, PayloadStatusEnumTC, ErrorCodeEnumTC } = createEnumsTC({
    schemaComposer,
  });

  const JobTC = createJobTC(schemaComposer, { JobStatusEnumTC });

  const QueueTC = createQueueTC(schemaComposer, { JobTC, JobStatusEnumTC });

  const { JobOptionsInputTC } = createInputTypes(schemaComposer);

  return {
    JobStatusEnumTC,
    PayloadStatusEnumTC,
    ErrorCodeEnumTC,
    JobTC,
    QueueTC,
    JobOptionsInputTC,
  };
}
