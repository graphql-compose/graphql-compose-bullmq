import UIntType from './ScalarUInt';
import BoolOrUIntType from './ScalarBoolOrUInt';

export default function ({ schemaComposer }) {
  return {
    UIntTC: schemaComposer.createScalarTC(UIntType),
    BoolOrUIntTC: schemaComposer.createScalarTC(BoolOrUIntType),
  };
}
