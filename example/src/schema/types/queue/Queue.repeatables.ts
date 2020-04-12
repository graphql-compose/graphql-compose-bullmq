import { Queue } from 'bullmq';
import { ObjectTypeComposerFieldConfigDefinition, SchemaComposer } from 'graphql-compose';

export function createRepeatablesFC(
  sc: SchemaComposer<any>
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  return {
    type: sc
      .createObjectTC({
        name: 'RepeatableJobInformation',
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
      return await queue.getRepeatableJobs();
    },
  };
}
