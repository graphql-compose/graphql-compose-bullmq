import { MutationError, ErrorCodeEnum } from './MutationError';
import { getBullConnection } from './getBullConnection';
import { Options } from '../definitions';

type Record = {
  id: string;
  nextTimestamp: string;
};

type Result = {
  first: Record;
  last: Record;
  fixLast: Record;
};

export async function addFixRecordToDelayStream(
  prefix: string,
  queueName: string,
  opts: Options,
  checkExistence: boolean = true
): Promise<Result> {
  const redis = getBullConnection(opts);

  const fullQueueName = [prefix, queueName].join(':');

  if (checkExistence) {
    const queueExists = await redis.exists([fullQueueName, 'meta'].join(':'));

    if (!queueExists) {
      throw new MutationError('Queue not found!', ErrorCodeEnum.QUEUE_NOT_FOUND);
    }
  }

  const streamName = fullQueueName + ':delay';

  const first = await redis.xrange(streamName, '-', '+', 'count', 1);
  const last = await redis.xrevrange(streamName, '+', '-', 'count', 1);
  const defaultRec = {
    id: '0-0',
    nextTimestamp: '',
  };
  const fixLastNextTimestamp = `${Date.now()}`;
  const fixLastId = await redis.xadd(streamName, '*', 'nextTimestamp', fixLastNextTimestamp);

  function readRecords(records: [string, string[]][]): Record {
    if (records.length > 0) {
      return {
        id: records[0][0],
        nextTimestamp: records[0][1][1],
      };
    } else {
      return defaultRec;
    }
  }

  return {
    first: readRecords(first),
    last: readRecords(last),
    fixLast: {
      id: fixLastId,
      nextTimestamp: fixLastNextTimestamp,
    },
  };
}
