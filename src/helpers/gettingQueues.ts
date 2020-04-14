import { Title } from './queueTitles';
import { Queue } from 'bullmq';
import { MutationError, ErrorCodeEnum } from './MutationError';
import { getBullConnection } from './getBullConnection';
import { Options } from '../definitions';

export function getQueues(titles: Array<Title>, opts: Options): Array<Queue> {
  return titles.map((title) => getQueue(title.prefix, title.queueName, opts));
}

export function getQueue(prefix: string, queueName: string, opts: Options): Queue {
  const queue = new Queue(queueName, {
    prefix,
    connection: getBullConnection(opts),
  });

  return queue;
}

export async function findQueue(
  prefix: string,
  queueName: string,
  opts: Options,
  checkExistence: boolean = true
): Promise<Queue> {
  const connection = getBullConnection(opts);

  if (checkExistence) {
    const queueExists = await connection.exists([prefix, queueName, 'meta'].join(':'));

    if (!queueExists) {
      throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
    }
  }

  const queue = new Queue(queueName, {
    prefix,
    connection,
  });

  return queue;
}
