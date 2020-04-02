import { GraphQLScalarType, GraphQLError, Kind, print } from 'graphql';
import inspect from 'graphql/jsutils/inspect';

function coerceUInt(inputValue) {
  if (Number.isInteger(inputValue) && inputValue >= 0) {
    return inputValue;
  }

  throw new GraphQLError(`Int cannot represent non u-integer value: ${inspect(inputValue)}`);
}

function serializeUInt(outputValue) {
  if (Number.isInteger(outputValue) && outputValue >= 0) {
    return outputValue;
  }

  if (typeof outputValue === 'string' && outputValue !== '') {
    const asNumber = Number(outputValue);
    if (Number.isInteger(asNumber) && asNumber >= 0) {
      return asNumber;
    }
  }

  throw new GraphQLError(`Boolean cannot represent a non u-integer value: ${inspect(outputValue)}`);
}

const BoolOrUIntType = new GraphQLScalarType({
  name: 'UInt',
  description: 'Unsigned integer',
  serialize: serializeUInt,
  parseValue: coerceUInt,
  parseLiteral: (astNode) => {
    if (astNode.kind === Kind.INT) {
      const asNumber = parseInt(astNode.value, 10);
      if (asNumber >= 0) {
        return asNumber;
      }
    }

    throw new GraphQLError(
      `BoolOrUInt cannot represent non u-integer value: ${print(astNode)}`,
      astNode
    );
  },
});

export default BoolOrUIntType;
