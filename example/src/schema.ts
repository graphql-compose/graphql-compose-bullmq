import { composeBull } from '../../src';
import { schemaComposer } from 'graphql-compose';

const { queryFields, mutationFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC: `type MyJobData { fieldA: String! fieldB: String}`,
});

schemaComposer.Query.addFields({
  ...queryFields,
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
});

export default schemaComposer.buildSchema();
