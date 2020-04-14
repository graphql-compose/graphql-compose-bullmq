import { Options } from './../definitions';
import { ObjectTypeComposerFieldConfigAsObjectDefinition } from 'graphql-compose';

export function predefineQueueArgs(
  fieldConfig: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  if (!opts.queue) {
    fieldConfig.args = {
      queueName: 'String!',
      prefix: {
        type: 'String',
        defaultValue: 'bull',
      },
      ...fieldConfig.args,
    };
  } else {
    const subResolve = fieldConfig.resolve || (() => ({}));
    fieldConfig.resolve = async (source, args, context, info) => {
      return subResolve(
        source,
        { queueName: opts.queue?.name, prefix: opts.queue?.prefix, ...args },
        context,
        info
      );
    };
  }

  return fieldConfig;
}
