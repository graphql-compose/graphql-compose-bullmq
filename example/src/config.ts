//import 'dotenv/config'

// const BULL_REDIS_URI = {
//   port: parseInt(process.env.REDIS_PORT || '6379'),
//   host: process.env.REDIS_HOST || '127.0.0.1',
//   password: process.env.REDIS_PASSWORD || '',
// };

const BULL_REDIS_URI = 'redis://127.0.0.1:6379';
//'redis://:uut2tiew5waeli1aefup0Toecaikoque5eepahch5AowaiJ2@10.216.129.127:6379';

const BULL_HOST_ID = 'maybe_uuid_and_mac';

export { BULL_REDIS_URI, BULL_HOST_ID };
