import { Job } from 'bullmq';
import { SchemaComposer } from 'graphql-compose';
import { getJobStatusEnumTC } from '../enums';

export function createStateFC(schemaComposer: SchemaComposer<any>) {
  return {
    type: getJobStatusEnumTC(schemaComposer),
    resolve: async (job: Job) => {
      return await job.getState();
    },
  };
}
