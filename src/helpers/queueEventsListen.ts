import { QueueEvents } from 'bullmq';
import { Options } from '../definitions';

export function getAsyncIterator(
  prefix: string,
  queueName: string,
  eventName: string,
  opts: Options
) {
  const queueEvents = getQueueEventsSingleton(prefix, queueName, opts);
  return createAsyncIterator(queueEvents, prefix, queueName, eventName);
}

const queueEventsMap = new Map();

function getQueueEventsSingleton(prefix: string, queueName: string, opts: Options): QueueEvents {
  const fullName = [prefix, queueName].join('.');

  if (queueEventsMap.has(fullName)) {
    return queueEventsMap.get(fullName);
  }

  const queueEvents = new QueueEvents(queueName, {
    prefix,
    connection: opts?.redisEvents,
  });

  queueEventsMap.set(fullName, queueEvents);

  return queueEvents;
}

function createAsyncIterator<T = any>(
  queueEvents: QueueEvents,
  prefix: string,
  queueName: string,
  eventName: string
): Required<AsyncIterator<T>> {
  let pullSeries: any = [];
  let pushSeries: any = [];
  let listening = true;

  const pushValue = async (event) => {
    if (pullSeries.length !== 0) {
      const resolver = pullSeries.shift();
      resolver(event);
    } else {
      pushSeries.push(event);
    }
  };

  const pullValue = () => {
    return new Promise((resolve) => {
      if (pushSeries.length !== 0) {
        const value = pushSeries.shift();
        resolve({ value, done: false });
      } else {
        pullSeries.push(resolve);
      }
    });
  };

  const handler = (event) => {
    pushValue({ prefix, queueName, ...event });
  };

  queueEvents.on(eventName, handler);

  function release() {
    if (listening) {
      listening = false;
      queueEvents.removeListener(eventName, handler);
      for (const resolve of pullSeries) {
        resolve({ value: undefined, done: true });
      }
      pullSeries = [];
      pushSeries = [];
    }
  }

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    return() {
      release();
      return Promise.resolve({ value: undefined, done: true });
    },
    next() {
      return listening ? pullValue() : this.return();
    },
    throw(error) {
      release();
      return Promise.reject(error);
    },
  } as Required<AsyncIterator<T>>;
}
