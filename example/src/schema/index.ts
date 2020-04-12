import { schemaComposer } from 'graphql-compose';
import { createQueryFields } from './query';
import { createMutationFields } from './mutation';

schemaComposer.Query.addFields({
  ...createQueryFields(schemaComposer),
});

schemaComposer.Mutation.addFields({
  ...createMutationFields(schemaComposer),
});

export default schemaComposer.buildSchema();
