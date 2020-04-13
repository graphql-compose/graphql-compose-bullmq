import { Options } from './definitions';
import { schemaComposer, SchemaComposer } from 'graphql-compose';
import { createQueryFields } from './query';
import { createMutationFields } from './mutation';
import { getQueueTC, getJobTC } from './types';

export function composeBull(opts: Options & { schemaComposer?: SchemaComposer<any> }) {
  const sc = opts?.schemaComposer || schemaComposer;

  return {
    QueueTC: getQueueTC(sc, opts),
    JobTC: getJobTC(sc, opts),
    queryFields: createQueryFields(sc, opts),
    mutationFields: createMutationFields(sc, opts),
  };
}

//---------------------------------------------------------

const jobDataTC = schemaComposer.createObjectTC({
  name: 'MyJobData',
  fields: {
    fieldA: 'String!',
    fieldB: 'String',
    fieldC: 'String',
  },
});

const { queryFields, mutationFields } = composeBull({
  schemaComposer,
  typePrefix: 'Prefix',
  jobDataTC,
});

schemaComposer.Query.addFields({
  ...queryFields,
});

schemaComposer.Mutation.addFields({
  ...mutationFields,
});

export default schemaComposer.buildSchema();
