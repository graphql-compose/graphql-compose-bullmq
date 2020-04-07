import { schemaComposer } from 'graphql-compose';
import {
  ObjectTypeComposer,
  ObjectTypeComposerFieldConfigAsObjectDefinition,
  ObjectTypeComposerAsObjectDefinition,
  ObjectTypeComposerFieldConfig,
  ObjectTypeComposerArgumentConfigMapDefinition,
} from 'graphql-compose';
import { PayloadStatusEnum, ErrorCodeEnum } from '../gqlTypes/enums';
import { Context as TContext } from '../../declarations';
import { GraphQLResolveInfo, GraphQLFieldResolver } from 'graphql';
import { PayloadError } from './../../declarations/errors';

export interface PayloadTypeConfig {
  name: string;
  fields: {
    [key: string]: ObjectTypeComposerFieldConfig<any, TContext>;
  };
}

export interface FieldConfig<TArgs, TFields = any> {
  type: ObjectTypeComposerAsObjectDefinition<any, TContext>;
  args?: ObjectTypeComposerArgumentConfigMapDefinition<TArgs>;
  resolve?: GraphQLFieldResolver<TArgs, TFields>;
  description?: string | null;
}

function queueNotFound(queueName: string) {
  return {
    queueName,
    status: PayloadStatusEnum.ERROR,
    errorCode: ErrorCodeEnum.QUEUE_NOT_FOUND,
    error: 'Queue not found!',
  };
}

export function generateMutation<TArgs>(fieldConfig: FieldConfig<TArgs>) {
  let type: ObjectTypeComposer;
  try {
    type = schemaComposer.createObjectTC(fieldConfig.type);
  } catch (e) {
    throw new Error('Cannot wrap mutation payload cause it returns non-object type.');
  }

  type.addFields({
    queueName: 'String!',
    status: 'PayloadStatusEnum!',
    query: 'Query!',
    error: 'String',
    errorCode: 'ErrorCodeEnum',
  });

  const oldResolve =
    fieldConfig.resolve ||
    async function (_source: any, _args: TArgs, _context: TContext, _info: GraphQLResolveInfo) {
      return {};
    };
  fieldConfig.resolve = async (source, args, context, info) => {
    const { Queues } = context;
    const { queueName } = args;

    const Queue = Queues.get(queueName);
    if (!Queue) return queueNotFound(queueName);

    let result = [];
    result['queueName'] = queueName;
    result['query'] = {};

    try {
      result = await oldResolve(source, args, { Queue, ...context }, info);
    } catch (e) {
      if (e instanceof PayloadError) {
        result['status'] = PayloadStatusEnum.ERROR;
        result['errorCode'] = e.code;
        result['error'] = e.message;
      } else {
        throw e;
      }
    }

    if (!result['status']) result['status'] = PayloadStatusEnum.OK;

    return result;
  };

  (fieldConfig as ObjectTypeComposerFieldConfigAsObjectDefinition<
    any,
    TContext,
    TArgs
  >).type = type;
  return fieldConfig; // as ObjectTypeComposerFieldConfigAsObjectDefinition<any, TContext, TArgs>
}
