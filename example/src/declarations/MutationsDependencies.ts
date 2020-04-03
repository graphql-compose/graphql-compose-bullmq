import { SchemaComposer, ObjectTC, InputTC } from './gqlCompose';
import { Context } from './Context';

export interface MutationsDependencies {
  schemaComposer: SchemaComposer<Context>;
  QueueTC: ObjectTC;
  JobTC: ObjectTC;
  JobOptionsInputTC: InputTC;
}
