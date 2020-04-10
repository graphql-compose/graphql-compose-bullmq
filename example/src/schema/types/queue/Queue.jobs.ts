import { Queue } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { getJobStatusEnumTC } from '../scalars/JobStatusEnum';
import { getJobTC } from '../job/Job';

export function createJobsFC(
  schemaComposer: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobTC(schemaComposer).getTypePlural(),
    args: {
      status: getJobStatusEnumTC(schemaComposer),
      start: {
        type: 'Int',
        defaultValue: 0,
      },
      end: {
        type: 'Int',
        defaultValue: -1,
      },
      // TODO: add sorting
    },
    resolve: async (queue: Queue, { status, start, end }) => {
      return await queue.getJobs([status], start, end, false);
    },
  };
}
