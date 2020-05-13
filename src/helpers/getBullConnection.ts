import { Options } from './../definitions';
import Redis from 'ioredis';

const connectionMap = new Map<Options['redis'], Redis.Redis>();

export function getBullConnection(opts: Options): Redis.Redis {
  const optsRedis = opts?.redis;
  let connection = connectionMap.get(optsRedis);
  if (connection) {
    return connection;
  }

  if (optsRedis instanceof Redis || optsRedis?.constructor?.name === 'Redis') {
    connection = optsRedis as Redis.Redis;
  } else if (optsRedis) {
    connection = new Redis(optsRedis);
  } else {
    connection = new Redis();
  }

  connectionMap.set(optsRedis, connection);

  return connection;
}
