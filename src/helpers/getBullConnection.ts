import { Options } from './../definitions';
import Redis from 'ioredis';

let connection: Redis.Redis;

export function getBullConnection(opts: Options): Redis.Redis {
  if (connection) {
    return connection;
  }

  if (opts.redis instanceof Redis) {
    connection = opts.redis;
  } else if (opts?.redis?.uri) {
    connection = new Redis(opts.redis.uri);
  } else if (opts?.redis?.opts) {
    connection = new Redis(opts.redis.opts);
  } else {
    connection = new Redis();
  }

  return connection;
}
