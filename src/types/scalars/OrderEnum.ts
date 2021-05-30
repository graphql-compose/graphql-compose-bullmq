import { EnumTypeComposer, SchemaComposer } from 'graphql-compose';
import { Options } from '../../definitions';

export enum OrderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

export function getOrderEnumTC(sc: SchemaComposer<any>, opts: Options): EnumTypeComposer {
  const { typePrefix } = opts;
  return sc.getOrCreateETC(`${typePrefix}OrderEnum`, (etc) => {
    etc.addFields({
      ASC: { value: 'asc' },
      DESC: { value: 'desc' },
    });
  });
}
