import { Options } from '../definitions';
import {
  SchemaComposer,
  getFlatProjectionFromAST,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
  ObjectTypeComposer,
  inspect,
} from 'graphql-compose';
import { MutationError, ErrorCodeEnum } from './Error';

export enum MutationStatusEnum {
  OK = 'ok',
  ERROR = 'error',
}

export type CreateFC = (
  sc: SchemaComposer<any>,
  opts: Options
) => ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;

export function createMutationFC(
  createFC: CreateFC,
  schemaComposer: SchemaComposer<any>,
  opts: Options
) {
  return wrapMutationFC(createFC(schemaComposer, opts), schemaComposer, opts);
}

export function wrapMutationFC(
  fieldConfig: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>,
  schemaComposer: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  if (!(fieldConfig.type instanceof ObjectTypeComposer)) {
    throw new Error(
      `Cannot wrap mutation payload cause it returns non-object type: ${inspect(fieldConfig)}`
    );
  }

  fieldConfig.type.addFields({
    status: getMutationStatusEnumTC(schemaComposer, opts),
    query: 'Query!',
    error: 'String',
    errorCode: getMutationErrorCodeEnumTC(schemaComposer, opts),
  });

  const subResolve = fieldConfig.resolve || (() => ({}));
  fieldConfig.resolve = async (source, args, context, info) => {
    try {
      const subResult = await subResolve(source, args, context, info);
      return {
        query: {},
        status: MutationStatusEnum.OK,
        ...subResult,
      };
    } catch (e) {
      const requestedFields = getFlatProjectionFromAST(info);
      if (requestedFields?.error || requestedFields?.errorCode || requestedFields?.status) {
        return {
          query: {},
          status: MutationStatusEnum.ERROR,
          error: e.message,
          errorCode: e instanceof MutationError ? e.code : ErrorCodeEnum.OTHER_ERROR,
        };
      } else {
        throw e;
      }
    }
  };

  return fieldConfig;
}

function getMutationErrorCodeEnumTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;

  return sc.getOrCreateETC(`${typePrefix}MutationErrorCodeEnum`, (etc) => {
    etc.addFields({
      QUEUE_NOT_FOUND: { value: ErrorCodeEnum.QUEUE_NOT_FOUND },
      JOB_NOT_FOUND: { value: ErrorCodeEnum.JOB_NOT_FOUND },
      OTHER_ERROR: { value: ErrorCodeEnum.OTHER_ERROR },
    });
  });
}

function getMutationStatusEnumTC(sc: SchemaComposer<any>, opts: Options) {
  const { typePrefix } = opts;

  return sc.getOrCreateETC(`${typePrefix}MutationStatusEnum`, (etc) => {
    etc.addFields({
      OK: { value: MutationStatusEnum.OK },
      ERROR: { value: MutationStatusEnum.ERROR },
    });
  });
}
