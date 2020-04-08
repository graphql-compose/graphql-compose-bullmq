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
  const Queue = context?.Queues?.get(queueName);
  if (!Queue) {
    throw new PayloadError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
  }
  return Queue;
}

export function generateMutation(
  schemaComposer: SchemaComposer<any>,
  fieldConfig: Omit<ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>, 'type'> & {
    type: ObjectTypeComposerAsObjectDefinition<any, any>;
  }
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
}
