import { SchemaComposer, ObjectTypeComposer, ComposeInputTypeDefinition } from 'graphql-compose';
import { Options } from '../../definitions';

export function createJobDataITC(
  sc: SchemaComposer<any>,
  opts: Options
): ComposeInputTypeDefinition {
  if (opts?.jobDataTC) {
    let someTC;
    if (typeof opts?.jobDataTC === 'string') {
      someTC = sc.getAnyTC(opts.jobDataTC) as any;
    } else {
      someTC = opts.jobDataTC;
    }

    if (someTC instanceof ObjectTypeComposer) {
      someTC = someTC.getInputTypeComposer();
    }

    return someTC.getTypeNonNull();
  } else {
    return 'JSON!';
  }
}
