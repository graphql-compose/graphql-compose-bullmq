import { ObjectTypeComposer } from 'graphql-compose';
import Redis, { RedisOptions } from 'ioredis';

export type Options = {
  typePrefix: string;
  jobDataTC?: string | ObjectTypeComposer<any, any>;
  queue?: {
    name?: string;
    names?: string[];
    prefix?: string;
  };
  redis?: RedisOptions | Redis;
  redisEvents?: RedisOptions | Redis;
  maxSizeOfJobData?: number /** in bytes */;
};
