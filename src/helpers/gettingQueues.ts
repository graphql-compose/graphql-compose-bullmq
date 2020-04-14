import { Title } from './queueTitles';
import { Queue } from 'bullmq';
import { createBullConnection } from '../connectRedis';
import { MutationError, ErrorCodeEnum } from './MutationError';

export function getQueues(titles: Array<Title>): Array<Queue> {
  return titles.map((title) => getQueue(title.prefix, title.queueName));
}

export function getQueue(prefix: string, queueName: string): Queue {
  const queue = new Queue(queueName, {
    prefix,
    connection: createBullConnection('queue'),
  });

  return queue;
}

export async function findQueue(
  prefix: string,
  queueName: string,
  checkExistence: boolean = true
): Promise<Queue> {
  const connection = createBullConnection('custom');

  if (checkExistence) {
    const queueExists = await connection.exists([prefix, queueName, 'meta'].join(':'));

    if (!queueExists) {
      throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
    }
  }

  const queue = new Queue(queueName, {
    prefix,
    connection: createBullConnection('queue'),
  });

  return queue;
}
