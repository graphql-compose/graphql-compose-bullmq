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

export async function scanQueueTitles(prefix: string, opts: Options): Promise<Array<Title>> {
  const connection = getBullConnection(opts);
  const normalizedPrefixGlob = normalizePrefixGlob(prefix);

  const result = await new Promise<string[]>((resolve, reject) => {
    //redis-cli: scan 0 match bull.vpc:*:meta count 100000
    const stream = connection.scanStream({ match: normalizedPrefixGlob, count: 100000 });

    const titles: string[] = [];

    stream.on('data', async (keys) => {
      for (let i = 0; i < keys.length; i++) {
        titles.push(keys[i]);
      }
    });

    stream.on('end', () => {
      resolve(titles);
    });

    stream.on('error', reject);
  });

  return result.map((key) => {
    const parts = key.split(':');
    return {
      prefix: parts.slice(0, -2).join(':'),
      queueName: parts[parts.length - 2],
    };
  });
}
