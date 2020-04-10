import { Queue } from 'bullmq';
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

export function getQueue(queueName: string, context: any): Queue {
  const queue = context?.Queues?.get(queueName);
  if (!queue) {
    throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
  }
  return queue;
}

type Generator = (
  fieldConfig: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>
) => ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;

export function createGenerateHelper(schemaComposer: SchemaComposer<any>): Generator {
  return function generateMutation(
    fieldConfig: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>
  ): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
    if (!(fieldConfig.type instanceof ObjectTypeComposer)) {
      throw new Error(
        `Cannot wrap mutation payload cause it returns non-object type: ${inspect(fieldConfig)}`
      );
    }

    fieldConfig.type.addFields({
      status: getMutationStatusEnumTC(schemaComposer),
      query: 'Query!',
      error: 'String',
      errorCode: getMutationErrorCodeEnumTC(schemaComposer),
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
  };
}

function getMutationErrorCodeEnumTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateETC('MutationErrorCodeEnum', (etc) => {
    etc.addFields({
      QUEUE_NOT_FOUND: { value: ErrorCodeEnum.QUEUE_NOT_FOUND },
      JOB_NOT_FOUND: { value: ErrorCodeEnum.JOB_NOT_FOUND },
      OTHER_ERROR: { value: ErrorCodeEnum.OTHER_ERROR },
    });
  });
}

function getMutationStatusEnumTC(sc: SchemaComposer<any>) {
  return sc.getOrCreateETC('MutationStatusEnum', (etc) => {
    etc.addFields({
      OK: { value: MutationStatusEnum.OK },
      ERROR: { value: MutationStatusEnum.ERROR },
    });
  });
}
