import { Queue } from 'bullmq';

export function createRepeatablesFC(schemaComposer) {
  return {
    type: schemaComposer.createObjectTC({
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
    }),
    resolve: async (queue: Queue) => {
      return await queue.getRepeatableJobs();
    },
  };
}
