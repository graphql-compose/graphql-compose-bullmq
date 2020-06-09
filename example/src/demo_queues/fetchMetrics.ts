import { Queue, Worker, QueueScheduler } from 'bullmq';
import { createBullConnection } from '../connectRedis';

export const queueSettings = {
  name: 'fetch_metrics',
  prefix: 'bull.demo',
};

const prefix = queueSettings.prefix;

const metricsScheduler = new QueueScheduler(queueSettings.name, {
  prefix,
  connection: createBullConnection('scheduler'), // BULL_REDIS_URI,
  stalledInterval: 900000,
});

export const metricsQueue = new Queue(queueSettings.name, {
  prefix,
  connection: createBullConnection('queue'), // BULL_REDIS_URI,
});

metricsQueue.add(
  'fetch_metrics_every_5m',
  { field1: 'asdasdadas' },
  { repeat: { cron: '*/1 * * * *' } }
);

metricsQueue.add('fetch_metrics_every_5000', { field1: 'asdasdadas' }, { repeat: { every: 5000 } });

const metricsWorker = new Worker(
  queueSettings.name,
  async (job) => {
    for (let i = 0; i < 5; i++) {
      job.updateProgress(i * 20);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
    console.log(`----> execution of job ${job.id} with data ${JSON.stringify(job.data)}`);

    //https://github.com/taskforcesh/bullmq/issues/69
    // console.log(new Date().toISOString(), 'Starting name: ' + job.name + ', job: ' + job.id);
    // return new Promise((resolve, reject) => {
    //   //setTimeout(() => reject('Здесь какая то причина ...'), 0);
    //   setTimeout(
    //     () =>
    //       resolve({
    //         status: 'job completed',
    //         result: new Date().toISOString(),
    //       }),
    //     100000
    //   );
    // });
  },
  {
    lockDuration: 900000,
    prefix,
    connection: createBullConnection('worker'), // BULL_REDIS_URI,
  }
);

metricsWorker.on('completed', (job) => {
  console.log(`${job.id} has completed!`);
});

metricsWorker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});

export default {
  name: queueSettings.name as string,
  prefix: queueSettings.prefix as string,
  bullQueue: metricsQueue,
  jobNames: ['fetch_metrics_every_5s'],
};
