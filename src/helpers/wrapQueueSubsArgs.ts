import { Options } from '../definitions';
import { ObjectTypeComposerFieldConfigAsObjectDefinition, SchemaComposer } from 'graphql-compose';

export function wrapQueueSubsArgs(
  fieldConfig: ObjectTypeComposerFieldConfigAsObjectDefinition<any, any>,
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigAsObjectDefinition<any, any> {
  // remove args if they provided via config
  if (opts?.queue?.name && fieldConfig.args?.queueName) {
    delete fieldConfig.args.queueName;
  }
  if (opts?.queue?.prefix && fieldConfig.args?.prefix) {
    delete fieldConfig.args.prefix;
  }

  // pass config props to sub resolve issue
  if (opts?.queue?.name || opts?.queue?.prefix) {
    const predifinedArgs = {} as Record<string, any>;
    if (opts?.queue?.name) predifinedArgs.queueName = opts.queue?.name;
    if (opts?.queue?.prefix) predifinedArgs.prefix = opts.queue?.prefix;

    const subSubscribe = fieldConfig.resolve || (() => ({}));
    fieldConfig.subscribe = async (source, args, context, info) => {
      return subSubscribe(source, { ...predifinedArgs, ...args }, context, info);
    };
  }

  return fieldConfig;
}
