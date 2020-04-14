import { composeBull } from '../../src';
import { schemaComposer } from 'graphql-compose';
import { createBullConnection } from './connectRedis';

const { queryFields, mutationFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC: `type MyJobData { fieldA: String! fieldB: String}`,
  queue: {
    name: 'fetch_metrics',
    prefix: 'bull.demo',
  },
  redis: createBullConnection('queue'),
});

schemaComposer.Query.addFields({
  ...queryFields,
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
});

export default schemaComposer.buildSchema();
