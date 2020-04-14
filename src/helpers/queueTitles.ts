import { createBullConnection } from '../connectRedis';
import { normalizePrefixGlob } from './normalizePrefixGlob';

export type Title = { prefix: string; queueName: string };

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
