import { SchemaComposer, ObjectTC } from './gqlCompose';
import { Context } from './Context';

export interface QueriesDependencies {
  schemaComposer: SchemaComposer<Context>;
  QueueTC: ObjectTC;
  JobTC: ObjectTC;
}
