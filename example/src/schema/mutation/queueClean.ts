import { JobStatusEnum } from '../gqlTypes/enums';
import { generateMutation } from './_helpers';

export default function createMutation({ schemaComposer }) {
  const QueueCleanPayload = schemaComposer.createObjectTC({
    name: 'QueueCleanPayload',
    fields: {
      //jobs: '[String!]',
    },
  });

  const QueueCleanFilter = schemaComposer
    .createInputTC({
      name: 'QueueCleanFilter',
      fields: {
        grace: 'UInt!',
        status: {
          type: 'JobStatusEnum',
          defaultValue: 'completed',
        },
        limit: {
          //TODO: дочитать умолчания для скалярных типов
          type: 'UInt',
          defaultValue: 0,
        },
      },
    })
    .getTypeNonNull();

  type FilterArg = {
    filter: {
      grace: number;
      status?: JobStatusEnum;
      limit?: number;
    };
  };

  return generateMutation<{ queueName: string; filter: FilterArg }>({
    type: QueueCleanPayload,
    args: {
      queueName: 'String!',
      filter: QueueCleanFilter,
    },
    resolve: async (_, { name, filter: { grace, status, limit } }, { Queue }) => {
      const jobs = await Queue.clean(grace, limit, status);
      return {
        //jobs,
      };
    },
  });
}
