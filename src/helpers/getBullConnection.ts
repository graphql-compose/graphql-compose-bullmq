import { Options } from './../definitions';
import Redis from 'ioredis';

const connectionMap = new Map<Options['redis'], Redis.Redis>();

export function getBullConnection(opts: Options): Redis.Redis {
  let connection = connectionMap.get(opts.redis);
  if (connection) {
    return connection;
  }

  if (opts?.redis instanceof Redis) {
    connection = opts.redis;
  } else if (opts?.redis) {
    connection = new Redis(opts.redis);
  } else {
    connection = new Redis();
  }

  connectionMap.set(opts.redis, connection);

  return connection;
}
