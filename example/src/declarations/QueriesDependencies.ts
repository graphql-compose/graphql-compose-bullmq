import { SchemaComposer, ObjectTC } from './gqlCompose';
import { Context } from './Context';
import { CreateJobNotFoundProblem } from './problems';

export interface QueriesDependencies {
  schemaComposer: SchemaComposer<Context>;
  QueueTC: ObjectTC;
  JobTC: ObjectTC;
  runOnQueue: Function;
  createJobNotFoundProblem: CreateJobNotFoundProblem;
  JobNotFoundProblemTC: ObjectTC;
  QueueNotFoundProblemTC: ObjectTC;
}
