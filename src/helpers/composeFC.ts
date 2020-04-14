import { SchemaComposer, ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';
import { Options } from '../definitions';

type FC = ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;

type Middleare = (fc: FC, sc: SchemaComposer<any>, opts: Options) => FC;

type Creator = (sc: SchemaComposer<any>, opts: Options) => FC;

type Wrapper = (creator: Creator) => FC;

type ComposeFCResult = (...args: Middleare[]) => Wrapper;

/**
 * Compose several FC creator with middlewares
 */
export function composeFC(sc: SchemaComposer<any>, opts: Options): ComposeFCResult {
  return (...middlewares: Middleare[]): Wrapper => (creator: Creator): FC => {
    let fc = creator(sc, opts);
    for (let i = 0; i < middlewares.length; i++) {
      fc = middlewares[i](fc, sc, opts);
    }
    return fc;
  };
}
