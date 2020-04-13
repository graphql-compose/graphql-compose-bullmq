import { createBullConnection } from '../../../connectRedis';
import { Queue } from 'bullmq';

export function getQueue(prefix: string, queueName: string): Queue {
  const queue = new Queue(queueName, {
    prefix,
    connection: createBullConnection('queue'),
  });

  return queue;
}

// export function getQueue(queueName: string, context: any): Queue {
//   const queue = context?.Queues?.get(queueName);
//   if (!queue) {
//     throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
//   }
//   return queue;
// }
