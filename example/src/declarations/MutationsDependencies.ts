import { SchemaComposer, ObjectTC, InputTC, EnumTC } from './gqlCompose';
import { CreateUnknownJobNameProblem } from './problems';
import { Context } from './Context';

export interface MutationsDependencies {
  schemaComposer: SchemaComposer<Context>;
  QueueTC: ObjectTC;
  JobTC: ObjectTC;
  JobOptionsInputTC: InputTC;
  StatusEnumTC: EnumTC;
  runOnQueue: Function;
  runOnJob: Function;
  JobNotFoundProblemTC: ObjectTC;
  createUnknownJobNameProblem: CreateUnknownJobNameProblem;
  UnknownJobNameProblemTC: ObjectTC;
  QueueNotFoundProblemTC: ObjectTC;
}
