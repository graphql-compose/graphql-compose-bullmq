import { SchemaComposer, ObjectTC, InputTC, EnumTC } from './gqlCompose';
import { Context } from './Context';

export interface MutationsDependencies {
  schemaComposer: SchemaComposer<Context>;
  QueueTC: ObjectTC;
  JobTC: ObjectTC;
  JobOptionsInputTC: InputTC;
  JobStatusEnumTC: EnumTC;
}
