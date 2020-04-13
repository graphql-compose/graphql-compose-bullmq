import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition, SchemaComposer } from 'graphql-compose';
import { Options } from '../../OptionsType';

export function createRepeatablesFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc
      .createObjectTC({
        name: `${typePrefix}RepeatableJobInformation`,
        fields: {
          key: 'String',
          name: 'String',
          id: 'String',
          endDate: 'Date',
          tz: 'String',
          cron: 'String',
          //every: 'Date', //TODO: вроде как должен быть обязательным, проверить - нет в бул-4
          next: 'Date',
        },
      })
      .getTypePlural(),
    resolve: async (queue: Queue) => {
      return queue.getRepeatableJobs();
    },
  };
}
