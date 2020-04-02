import { isObject } from './utils';

export default function ({
  schemaComposer,
  QueueTC,
  JobTC,
  runOnQueue,
  createJobNotFoundProblem,
  JobNotFoundProblemTC,
  QueueNotFoundProblemTC,
}) {
  schemaComposer.createUnionTC({
    name: 'QueueResultUnion',
    types: [QueueNotFoundProblemTC, QueueTC],
    resolveType(result) {
      if (
        isObject(result) &&
        result.hasOwnProperty('type') &&
        result.type === 'QueueNotFoundProblem'
      ) {
        return result.type;
      }
      if (isObject(result) && result.hasOwnProperty('name')) {
        return 'Queue';
      }
      return null;
    },
  });

  schemaComposer.createUnionTC({
    name: 'JobResultUnion',
    types: [JobNotFoundProblemTC, QueueNotFoundProblemTC, JobTC],
    resolveType(result) {
      if (
        isObject(result) &&
        result.hasOwnProperty('type') &&
        (result.type === 'QueueNotFoundProblem' || result.type === 'JobNotFoundProblem')
      ) {
        return result.type;
      }
      if (isObject(result) && result.hasOwnProperty('id')) {
        return 'Job';
      }
      return null;
    },
  });

  return {
    queues: {
      type: QueueTC.getTypeNonNull().getTypePlural().getTypeNonNull(),
      resolve: (_, __, { Queues }) => {
        return Queues;
      },
    },
    queue: {
      type: 'QueueResultUnion!',
      args: {
        name: 'String!',
      },
      resolve: runOnQueue((_, { queue }) => queue),
    },
    job: {
      type: 'JobResultUnion',
      args: {
        queueName: 'String!',
        id: 'String!',
      },
      resolve: runOnQueue(async (_, { queue, id }) => {
        const job = await queue.bullQueue.getJob(id);
        if (!job) return createJobNotFoundProblem(queue.name, id);
        return job;
      }),
    },
  };
}
