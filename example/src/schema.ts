import { composeBull } from '../../src';
import { schemaComposer } from 'graphql-compose';
import { createBullConnection } from './connectRedis';

const { queryFields, mutationFields, subscriptionFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC: `type MyJobData { fieldA: String! fieldB: String}`,
  queue: {
    name: 'fetch_metrics',
    prefix: 'bull.demo',
  },
  redis: createBullConnection('queue'),
  redisEvents: createBullConnection('events'),
});

schemaComposer.Query.addFields({
  ...queryFields,
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
});

if (subscriptionFields) {
  schemaComposer.Subscription.addFields({
    ...subscriptionFields,
  });
}

export default schemaComposer.buildSchema();
