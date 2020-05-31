import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { getInfoTC } from '../types/info/Info';
import { Options } from '../definitions';

export function createInfoFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  return {
    type: getInfoTC(sc, opts),
    resolve: async () => {
      return {};
    },
  };
}
