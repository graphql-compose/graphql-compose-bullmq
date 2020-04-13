import { MutationError, ErrorCodeEnum } from './Error';
import { createBullConnection } from '../../../connectRedis';
import { Queue } from 'bullmq';

export async function findQueue(prefix: string, queueName: string): Promise<Queue> {
  const connection = createBullConnection('custom');
  const queueExists = await connection.exists([prefix, queueName, 'meta'].join(':'));

  if (!queueExists) {
    throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
  }

  const queue = new Queue(queueName, {
    prefix,
    connection: createBullConnection('queue'),
  });

  return queue;
}
