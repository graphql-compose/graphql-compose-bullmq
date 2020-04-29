# graphql-compose-bullmq

[![travis build](https://img.shields.io/travis/graphql-compose/graphql-compose-bullmq.svg)](https://travis-ci.org/graphql-compose/graphql-compose-bullmq)
[![codecov coverage](https://img.shields.io/codecov/c/github/graphql-compose/graphql-compose-bullmq.svg)](https://codecov.io/github/graphql-compose/graphql-compose-bullmq)
[![npm](https://img.shields.io/npm/v/graphql-compose-bullmq.svg)](https://www.npmjs.com/package/graphql-compose-bullmq)
[![trends](https://img.shields.io/npm/dt/graphql-compose-bullmq.svg)](http://www.npmtrends.com/graphql-compose-bullmq)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Fully automated version management and package publishing](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

This is a plugin for [graphql-compose](https://github.com/graphql-compose/graphql-compose), which generates GraphQLTypes for [bullmq](https://github.com/taskforcesh/bullmq).

## Installation

```bash
npm install graphql graphql-compose bullmq graphql-compose-bullmq --save
```

Modules `graphql`, `graphql-compose`, `bullmq` are in `peerDependencies`, so should be installed explicitly in your app. They have global objects and should not have ability to be installed as submodule.

## Example

```js
import { composeBull } from 'graphql-compose-bullmq';
import { schemaComposer } from 'graphql-compose';

const { queryFields, mutationFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC: `type MyJobData { fieldA: String! fieldB: String}`,
  queue: {
    name: 'fetch_metrics',
    prefix: 'bull.demo',
  },
  redis: 'redis://127.0.0.1:6379',
});

schemaComposer.Query.addFields({
  ...queryFields,
  // Will provide the following fields:
  //   queueKeys
  //   queues
  //   queue
  //   job
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
  // Will provide the following fields:
  //   queueClean
  //   queueDrain
  //   queuePause
  //   queueResume
  //   queueRemoveRepeatable
  //   jobAdd
  //   jobAddBulk
  //   jobAddRepeatableCron
  //   jobAddRepeatableEvery
  //   jobDiscard
  //   jobPromote
  //   jobRemove
  //   jobRetry
  //   jobUpdate
  //   jobLogAdd
});

const schema = schemaComposer.buildSchema();
```

## Schema

`composeBull` will generate particles for your further schema. It contains more than 40 types wich helps to you work with Bull Queues. You may see generated files in [schema.graphql](./example/schema.graphql) file. It can be visialized with <https://apis.guru/graphql-voyager/> in the following manner:

### Queries

<img width="1323" alt="Screen Shot 2020-04-14 at 21 22 38" src="https://user-images.githubusercontent.com/1946920/79242603-5ab18900-7e96-11ea-8aad-7aff95e285ba.png">

### Mutations

<img width="1327" alt="Screen Shot 2020-04-14 at 21 24 05" src="https://user-images.githubusercontent.com/1946920/79242633-61d89700-7e96-11ea-9efc-3afadc3e082c.png">

## License

[MIT](https://github.com/graphql-compose/graphql-compose-bullmq/blob/master/LICENSE.md)
