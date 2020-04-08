import { Queue } from 'bullmq';
import { SchemaComposer } from 'graphql-compose';
import { getJobStatusEnumTC } from '../enums';

export function createJobsFC(schemaComposer: SchemaComposer<any>, { JobTC }) {
  return {
    type: [JobTC],
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
