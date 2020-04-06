import { QueriesDependencies, Context } from '../declarations';
import { ObjectTypeComposerFieldConfigMapDefinition } from 'graphql-compose';

export default function ({
  QueueTC,
  JobTC,
}: QueriesDependencies): ObjectTypeComposerFieldConfigMapDefinition<any, Context> {
  return {
    queues: {
      type: QueueTC.getTypeNonNull().getTypePlural(),
      resolve: (_, __, { Queues }) => {
        return Queues.values();
      },
    },
    queue: {
      type: QueueTC,
      args: {
        name: 'String!',
      },
      resolve: async (_, { name }, { Queues }) => {
        if (Queues.has(name)) return Queues.get(name);
        return null;
      },
    },
    job: {
      type: JobTC,
      args: {
        name: 'String!',
        id: 'String!',
      },
      resolve: async (_, { name, id }, { Queues }) => {
        if (!Queues.has(name)) return null;
        let job = await Queues.get(name).getJob(id);
        if (!job) return null;
        return job;
      },
    },
  };
}
