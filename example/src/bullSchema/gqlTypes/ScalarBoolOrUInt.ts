import { GraphQLScalarType, GraphQLError, Kind, print } from 'graphql';
import inspect from 'graphql/jsutils/inspect'; //TODO: какие еще варианты?

function coerceBooleanOrUInt(inputValue) {
  if (typeof inputValue === 'boolean') {
    return inputValue;
  }

  if (Number.isInteger(inputValue) && inputValue >= 0) {
    return inputValue;
  }

  throw new GraphQLError(
    `Int cannot represent non u-integer or boolean value: ${inspect(inputValue)}`
  );
}

function serializeBooleanOrUInt(outputValue) {
  if (typeof outputValue === 'boolean') {
    return outputValue;
  }

  if (Number.isInteger(outputValue) && outputValue >= 0) {
    return outputValue;
  }

  if (typeof outputValue === 'string' && outputValue !== '') {
    const asNumber = Number(outputValue);
    if (Number.isInteger(asNumber) && asNumber >= 0) {
      return asNumber;
    }
  }

  throw new GraphQLError(
    `Boolean cannot represent a non u-integer or boolean value: ${inspect(outputValue)}`
  );
}

const BoolOrUIntType = new GraphQLScalarType({
  name: 'BoolOrUInt',
  description: 'Boolean or u-integer',
  serialize: serializeBooleanOrUInt,
  parseValue: coerceBooleanOrUInt,
  parseLiteral: (astNode) => {
    if (astNode.kind === Kind.INT) {
      const asNumber = parseInt(astNode.value, 10);
      if (asNumber >= 0) {
        return asNumber;
      }
    } else if (astNode.kind === Kind.BOOLEAN) {
      return astNode.value;
    }

    throw new GraphQLError(
      `BoolOrUInt cannot represent non u-integer or boolean value: ${print(astNode)}`,
      astNode
    );
  },
});

export default BoolOrUIntType;
