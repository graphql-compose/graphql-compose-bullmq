import { QueueEvents } from 'bullmq';
import { Options } from '../definitions';

export function getAsyncIterator(
  prefix: string,
  queueName: string,
  eventName: string,
  opts: Options
) {
  const queueEvents = getQueueEvents(prefix, queueName, opts);
  return createAsyncIterator(queueEvents, prefix, queueName, eventName);
}

const queueEventsMap = new Map();

function getQueueEvents(prefix: string, queueName: string, opts: Options): QueueEvents {
  const fullName = [prefix, queueName].join('.');

  if (queueEventsMap.has(fullName)) {
    return queueEventsMap.get(fullName);
  }

  const queueEvents = new QueueEvents(queueName, {
    prefix,
    //connection: new Redis(),
  });

  queueEventsMap.set(fullName, queueEvents);

  return queueEvents;
}

function createAsyncIterator<T = any>(
  queueEvents: QueueEvents,
  prefix: string,
  queueName: string,
  eventName: string
): AsyncIterator<T> {
  const pullSeries: any = [];
  const pushSeries: any = [];
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
      pullSeries.length = 0;
      pushSeries.length = 0;
    }
  }

  const returnProp = function () {
    release();
    return Promise.resolve({ value: undefined, done: true });
  };

  return {
    [Symbol.asyncIterator]() {
      return this;
    },
    return: returnProp,
    next() {
      return listening ? pullValue() : returnProp();
    },
    throw(error) {
      release();
      return Promise.reject(error);
    },
  } as AsyncIterator<T>;
}
