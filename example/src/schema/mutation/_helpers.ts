import { Queue } from 'bullmq';
import {
  SchemaComposer,
  getFlatProjectionFromAST,
  ObjectTypeComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
  ObjectTypeComposerAsObjectDefinition,
} from 'graphql-compose';
import { PayloadStatusEnum, ErrorCodeEnum } from '../types/enums';
import { PayloadError } from '../../declarations/errors';

export function getQueue(queueName: string, context: any): Queue {
  const queue = context?.Queues?.get(queueName);
  if (!queue) {
    throw new PayloadError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
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
      status: 'PayloadStatusEnum!',
      query: 'Query!',
      error: 'String',
      errorCode: 'ErrorCodeEnum',
    });

    const subResolve = fieldConfig.resolve || (() => ({}));
    const resolve = async (source, args, context, info) => {
      try {
        const subResult = await subResolve(source, args, context, info);
        return {
          query: {},
          status: PayloadStatusEnum.OK,
          ...subResult,
        };
      } catch (e) {
        const requestedFields = getFlatProjectionFromAST(info);
        if (requestedFields?.error || requestedFields?.errorCode || requestedFields?.status) {
          return {
            query: {},
            status: PayloadStatusEnum.ERROR,
            error: e.message,
            errorCode: e instanceof PayloadError ? e.code : ErrorCodeEnum.OTHER_ERROR,
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
