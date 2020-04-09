import { Job } from 'bullmq';
import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { getJobStatusEnumTC } from '../enums';

export function createStateFC(
  schemaComposer: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: getJobStatusEnumTC(schemaComposer),
    resolve: async (job: Job) => {
      return await job.getState();
    },
  };
}
