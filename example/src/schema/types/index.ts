import { createInputTypes } from './input';
import { createQueueTC } from './queue';
import { createJobTC } from './job';

export default function ({ schemaComposer }) {
  const JobTC = createJobTC(schemaComposer);
  const QueueTC = createQueueTC(schemaComposer, { JobTC });

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
