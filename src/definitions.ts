import { ObjectTypeComposer } from 'graphql-compose';
import IORedis, { RedisOptions } from 'ioredis';

export type Options = {
  typePrefix: string;
  jobDataTC?: string | ObjectTypeComposer<any, any>;
  queue?: {
    name?: string;
    prefix?: string;
  };
  redis?: RedisOptions | IORedis.Redis;
};
