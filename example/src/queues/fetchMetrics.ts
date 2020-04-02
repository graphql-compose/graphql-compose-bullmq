import { BULL_REDIS_URI, BULL_HOST_ID } from '../config';
import { Queue, Worker, QueueScheduler } from 'bullmq';

if (!BULL_REDIS_URI) {
  throw new Error(`Env var BULL_REDIS_URI is empty. Cannot init task ${__filename}.`);
}

export const queueSettings = {
  hostId: BULL_HOST_ID,
  name: 'fetch_metrics',
  prefix: 'bull.fetch-metrics',
};

const prefix = queueSettings.prefix;

const metricsScheduler = new QueueScheduler(queueSettings.name, {
  prefix,
  connection: BULL_REDIS_URI,
});

export const metricsQueue = new Queue(queueSettings.name, {
  prefix,
  connection: BULL_REDIS_URI,
});

metricsQueue.add(
  'fetch_metrics_every_5m',
  { field1: 'asdasdadas' },
  { repeat: { cron: '*/1 * * * *' } }
);

const metricsWorker = new Worker(
  queueSettings.name,
  async (job) => {
    //https://github.com/taskforcesh/bullmq/issues/69
    console.log(new Date().toISOString(), 'Starting name: ' + job.name + ', job: ' + job.id);
    return new Promise((resolve) => {
      setTimeout(() =>
        resolve({
          status: 'job completed',
          result: new Date().toISOString(),
        })
      );
    });
  },
  {
    prefix,
    connection: metricsQueue.client,
  }
);

metricsWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

metricsWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

export default {
  name: queueSettings.name,
  hostId: queueSettings.hostId,
  prefix: queueSettings.prefix,
  bullQueue: metricsQueue,
  jobNames: ['fetch_metrics_every_5m'],
};
