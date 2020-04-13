import { createBullConnection } from '../../connectRedis';
import { Queue } from 'bullmq';

export function normalizePrefixGlob(prefixGlob: string): string {
  let prefixGlobNorm = prefixGlob;
  const nameCase = prefixGlobNorm.split(':').length - 1;
  if (nameCase >= 2) {
    prefixGlobNorm = prefixGlobNorm.split(':').slice(0, 2).join(':') + ':';
  } else if (nameCase === 1) {
    prefixGlobNorm += prefixGlobNorm.endsWith(':') ? '*:' : ':';
  } else {
    prefixGlobNorm += ':*:';
  }
  prefixGlobNorm += 'meta';

  return prefixGlobNorm;
}

type Title = { prefix: string; queueName: string };

export async function fetchQueueTitles(prefix: string): Promise<Array<Title>> {
  const connection = createBullConnection('custom');
  const keys = await connection.keys(normalizePrefixGlob(prefix));

  return keys.map((key) => {
    const parts = key.split(':');
    return {
      prefix: parts[0],
      queueName: parts[1],
    };
  });
}

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
