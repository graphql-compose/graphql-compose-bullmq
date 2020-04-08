//import 'dotenv/config'

const BULL_REDIS_URI = {
  port: parseInt(process.env.REDIS_PORT || '6379'),
  host: process.env.REDIS_HOST || '127.0.0.1',
  password: process.env.REDIS_PASSWORD || '',
};

const BULL_HOST_ID = 'maybe_uuid_and_mac';

export { BULL_REDIS_URI, BULL_HOST_ID };
