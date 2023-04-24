import { ObjectTypeComposer } from 'graphql-compose';
import Redis, { RedisOptions } from 'ioredis';

export type Options = {
  typePrefix: string;
  jobDataTC?: string | ObjectTypeComposer<any, any>;
  queue?: {
    name?: string;
    prefix?: string;
  };
  redis?: RedisOptions | Redis;
};
