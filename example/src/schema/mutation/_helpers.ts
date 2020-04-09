import { Queue } from 'bullmq';
import {
  SchemaComposer,
  getFlatProjectionFromAST,
  ObjectTypeComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
  ObjectTypeComposerAsObjectDefinition,
} from 'graphql-compose';
import {
  MutationStatusEnum,
  ErrorCodeEnum,
  getMutationStatusEnumTC,
  getMutationErrorCodeEnumTC,
} from '../types';
import { MutationError } from './Error';

export function getQueue(queueName: string, context: any): Queue {
  const queue = context?.Queues?.get(queueName);
  if (!queue) {
    throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
  }
  return queue;
}

type FieldConfig = Omit<ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>, 'type'> & {
  type: ObjectTypeComposerAsObjectDefinition<any, any>;
};

type Generator = (
  fieldConfig: FieldConfig
) => ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>;

export function createGenerateHelper(schemaComposer: SchemaComposer<any>): Generator {
  return function generateMutation(
    fieldConfig: FieldConfig
  ): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
    let type: ObjectTypeComposer;
    try {
      type = schemaComposer.createObjectTC(fieldConfig.type as any);
    } catch (e) {
      throw new Error('Cannot wrap mutation payload cause it returns non-object type.');
    }

    type.addFields({
      status: getMutationStatusEnumTC(schemaComposer),
      query: 'Query!',
      error: 'String',
      errorCode: getMutationErrorCodeEnumTC(schemaComposer),
    });

    const subResolve = fieldConfig.resolve || (() => ({}));
    const resolve = async (source, args, context, info) => {
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

    return {
      ...fieldConfig,
      type,
      resolve,
    };
  };
}
