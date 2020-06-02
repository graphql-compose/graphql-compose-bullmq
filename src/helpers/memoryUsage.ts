import { getBullConnection } from './getBullConnection';
import { Options } from '../definitions';
import Redis from 'ioredis';
import path from 'path';
import util from 'util';
import fs from 'fs';

let commandDefined = false;

async function defineCommand(redis: Redis.Redis) {
  const readFile = util.promisify(fs.readFile);
  const lua = await readFile(path.join(__dirname, 'zsetKeysMemoryUsage.lua'));

  redis.defineCommand('zsetKeysMemoryUsage', { numberOfKeys: 0, lua: lua.toString() });

  commandDefined = true;
}

export async function getZsetKeysMemoryUsageAvg(
  prefix: string,
  queueName: string,
  keySetName: string,
  limit: number,
  opts: Options
): Promise<number> {
  const redis = getBullConnection(opts);

  if (!commandDefined) {
    await defineCommand(redis);
  }

  const fullPrefix = [prefix, queueName].join(':');

  const [amountBytes, jobsCount] = await (redis as any).zsetKeysMemoryUsage(
    fullPrefix + ':',
    keySetName,
    limit
  );

  return amountBytes / (jobsCount || 1);
}
