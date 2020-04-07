import { schemaComposer } from 'graphql-compose';
import createTypes from './gqlTypes';
import { createQueryFields } from './query';
import { createMutationFields } from './mutation';

const { JobTC, QueueTC, JobOptionsInputTC } = createTypes({ schemaComposer });

schemaComposer.Query.addFields({
  ...createQueryFields({ QueueTC, JobTC }),
});

schemaComposer.Mutation.addFields({
  ...createMutationFields({
    schemaComposer,
    JobTC,
    JobOptionsInputTC,
  }),
});

export default schemaComposer.buildSchema();
