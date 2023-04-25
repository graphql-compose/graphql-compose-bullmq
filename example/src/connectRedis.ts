import Redis, { RedisOptions } from 'ioredis';

// TODO: remove get from OPTIONS
const BULL_REDIS_URI = process.env.BULL_REDIS_URI || 'redis://127.0.0.1:6379';

const redisInstances = new Map<string, Redis>();

export function createBullConnection(type: 'queue' | 'worker' | 'scheduler' | 'events' | 'custom') {
  const existedClient = redisInstances.get(type);
  if (existedClient) {
    return existedClient;
  }

  const client = connectRedis(BULL_REDIS_URI);
  if (!client) {
    throw new Error(`No redisio connection provided to BULL (${BULL_REDIS_URI})!`);
  }

  redisInstances.set(type, client);
  return client;
}

/**
 * Connect to Redis by URI.
 *
 * Returns tuple of 2 elements:
 *   [0] redisio instance
 *   [1] addBeforeShutdown function which will be called before redis shutdown
 *       this function is usefull when you want to await current Worker's jobs before disconnection redis.
 *
 * See https://github.com/lettuce-io/lettuce-core/wiki/Redis-URI-and-connection-details for URI formats
 * redis://localhost/0
 * rediss://localhost/0
 * redis-sentinel://:pass@localhost:26379,otherhost:26479/0?name=mymaster
 */
export function connectRedis(uri: string, opts?: RedisOptions): Redis {
  // TODO: UnhandledPromiseRejectionWarning: MaxRetriesPerRequestError: Reached the max retries per request limit (which is 20). Refer to "maxRetriesPerRequest" option for details.
  let cfg = {
    maxRetriesPerRequest: null,
    retryStrategy: (times: number) => Math.min(times * 500, 10000),
    reconnectOnError: (err: Error) => {
      const targetError = 'READONLY';
      if (err.message.slice(0, targetError.length) === targetError) {
        // Only reconnect when the error starts with "READONLY"
        // and resend the failed command after reconnecting
        return 2;
      }
      return false;
    },
  } as RedisOptions;

  const cs = connectionStringParse(uri);
  if (cs.scheme === 'redis' || cs.scheme === 'rediss') {
    cfg.host = cs.hosts?.[0]?.host || 'localhost';
    cfg.port = cs.hosts?.[0]?.port || 6379;
    if (cs.scheme === 'rediss') {
      cfg.tls = {};
    }
    if (cs.password) {
      cfg.password = cs.password;
    }
  } else if (
    cs.scheme === 'redis-sentinel' ||
    cs.scheme === 'redis+sentinel' ||
    cs.scheme === 'redis+santinel'
  ) {
    cfg.sentinels = cs.hosts as any;
    if (cs.password) {
      cfg.sentinelPassword = cs.password;
    }
    cfg.sentinelRetryStrategy = (times: number) => Math.min(times * 500, 10000);
  } else {
    throw new Error(`Unsupported connection string provided to connectRedis() method: ${uri}`);
  }

  if (cs?.path?.[0]) {
    cfg.db = parseInt(cs?.path?.[0]) || 0;
  }
  if (cs?.options?.db) {
    // convert '0' -> 0
    cs.options.db = parseInt(cs.options.db) || 0;
  }

  cfg = { ...cfg, ...cs.options, ...opts };

  const redis = new Redis(cfg);
  return redis;
}

export interface ConnectionStringHost {
  host: string;
  port?: number;
}

export interface ConnectionStringParameters {
  scheme: string;
  username?: string;
  password?: string;
  hosts: ConnectionStringHost[];
  path: string[];
  options?: any;
}

/**
 * Takes a connection string object and returns a URI string of the form:
 *
 * scheme://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[endpoint]][?options]
 * @param connectionStringObject The object that describes connection string parameters
 */
export function connectionStringSerialize(connectionStringObject: ConnectionStringParameters) {
  if (!connectionStringObject.scheme) {
    throw new Error(`Scheme not provided`);
  }

  let uri = connectionStringObject.scheme + '://';

  if (connectionStringObject.username) {
    uri += encodeURIComponent(connectionStringObject.username);
    // Allow empty passwords
    if (connectionStringObject.password) {
      uri += ':' + encodeURIComponent(connectionStringObject.password);
    }
    uri += '@';
  }
  uri += _formatAddress(connectionStringObject);
  // Only put a slash when there is an endpoint
  if (Array.isArray(connectionStringObject.path)) {
    const path = connectionStringObject.path
      .filter((o) => o === null || o === undefined || o === '')
      .map((o) => encodeURIComponent(o))
      .join('/');
    if (path) {
      uri += '/' + path;
    }
  }
  if (connectionStringObject.options && Object.keys(connectionStringObject.options).length > 0) {
    uri +=
      '?' +
      Object.keys(connectionStringObject.options)
        .map(
          (option) =>
            encodeURIComponent(option) +
            '=' +
            encodeURIComponent(connectionStringObject.options[option])
        )
        .join('&');
  }
  return uri;
}

/**
 * Takes a connection string URI of form:
 *
 *   scheme://[username[:password]@]host1[:port1][,host2[:port2],...[,hostN[:portN]]][/[path]][?options]
 *
 * and returns an object of form:
 *
 *   {
 *     scheme: string,
 *     username?: string,
 *     password?: string,
 *     hosts: [ { host: string, port?: number }, ... ],
 *     path?: string[],
 *     options?: object
 *   }
 *
 * Where scheme and hosts will always be present. Other fields will only be present in the result if they were
 * present in the input.
 * @param uri The connection string URI
 */
export function connectionStringParse(uri: string): ConnectionStringParameters {
  const connectionStringParser = new RegExp(
    '^\\s*' + // Optional whitespace padding at the beginning of the line
      '([^:]+):\\/\\/' + // Scheme (Group 1)
      '(?:([^:@,/?=&]*)' + // User (Group 2)
      '(?::([^:@,/?=&]*))?@)?' + // Password (Group 3)
      '([^@/?=&]+)' + // Host address(es) (Group 4)
      '(?:\\/([^:@,?=&]+)?)?' + // Endpoint (Group 5)
      '(?:\\?([^:@,/?]+)?)?' + // Options (Group 6)
      '\\s*$', // Optional whitespace padding at the end of the line
    'gi'
  );
  const connectionStringObject = {} as ConnectionStringParameters;

  if (!uri.includes('://')) {
    throw new Error(`No scheme found in URI ${uri}`);
  }

  const tokens = connectionStringParser.exec(uri);

  if (Array.isArray(tokens)) {
    connectionStringObject.scheme = tokens[1];
    connectionStringObject.username = tokens[2] ? decodeURIComponent(tokens[2]) : tokens[2];
    connectionStringObject.password = tokens[3] ? decodeURIComponent(tokens[3]) : tokens[3];
    connectionStringObject.hosts = _parseAddress(tokens[4]);
    connectionStringObject.path = tokens[5]
      ? tokens[5].split('/').map((o) => decodeURIComponent(o))
      : [];
    connectionStringObject.options = tokens[6] ? _parseOptions(tokens[6]) : tokens[6];
  }
  return connectionStringObject;
}

/**
 * Formats the address portion of a connection string
 * @param connectionStringObject The object that describes connection string parameters
 */
function _formatAddress(connectionStringObject: ConnectionStringParameters): string {
  return connectionStringObject.hosts
    .map(
      (address) =>
        encodeURIComponent(address.host) +
        (address.port ? ':' + encodeURIComponent(address.port.toString(10)) : '')
    )
    .join(',');
}

/**
 * Parses an address
 * @param addresses The address(es) to process
 */
function _parseAddress(addresses: string): ConnectionStringHost[] {
  return addresses.split(',').map((address) => {
    const i = address.indexOf(':');

    return (
      i >= 0
        ? { host: decodeURIComponent(address.substring(0, i)), port: +address.substring(i + 1) }
        : { host: decodeURIComponent(address) }
    ) as ConnectionStringHost;
  });
}

/**
 * Parses options
 * @param options The options to process
 */
function _parseOptions(options: string): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  options.split('&').forEach((option) => {
    const i = option.indexOf('=');

    if (i >= 0) {
      result[decodeURIComponent(option.substring(0, i))] = decodeURIComponent(
        option.substring(i + 1)
      );
    }
  });
  return result;
}
