import { createMemoryFC } from './Info.memory';
import { ObjectTypeComposer, SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export function getInfoTC(sc: SchemaComposer<any>, opts: Options): ObjectTypeComposer {
  const { typePrefix } = opts;

  return sc.getOrCreateOTC(`${typePrefix}Info`, (etc) => {
    etc.addFields({
      memory: createMemoryFC(sc, opts),
    });
  });
}
