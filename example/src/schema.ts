import { composeBull } from '../../src';
import { schemaComposer } from 'graphql-compose';

const { queryFields, mutationFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC: `type MyJobData { fieldA: String! fieldB: String}`,
  queue: {
    name: 'fetch_metrics',
    prefix: 'bull.demo',
  },
});

schemaComposer.Query.addFields({
  ...queryFields,
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
});

export default schemaComposer.buildSchema();
