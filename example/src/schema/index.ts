import { schemaComposer } from 'graphql-compose';
import createTypes from './types';
import { createQueryFields } from './query';
import { createMutationFields } from './mutation';

const { JobTC, QueueTC, JobOptionsInputTC, JobStatusEnumTC } = createTypes({ schemaComposer });

schemaComposer.Query.addFields({
  ...createQueryFields({ QueueTC, JobTC }),
});

schemaComposer.Mutation.addFields({
  ...createMutationFields({
    schemaComposer,
    JobTC,
    JobOptionsInputTC,
    JobStatusEnumTC,
  }),
});

export default schemaComposer.buildSchema();
