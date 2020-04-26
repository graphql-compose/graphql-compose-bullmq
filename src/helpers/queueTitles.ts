import { Options } from './../definitions';
import { normalizePrefixGlob } from './normalizePrefixGlob';
import { getBullConnection } from './getBullConnection';

export type Title = { prefix: string; queueName: string };

export async function fetchQueueTitles(prefix: string, opts: Options): Promise<Array<Title>> {
  const connection = getBullConnection(opts);
  const keys = await connection.keys(normalizePrefixGlob(prefix));

  return keys.map((key) => {
    const parts = key.split(':');
    return {
      prefix: parts.slice(0, -2).join(':'),
      queueName: parts[parts.length - 2],
    };
  });
}
