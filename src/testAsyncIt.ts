//----------------------------------
//ACTIVE
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'active',
//   jobId: 'repeat:fetch_metrics_every_100000:5490b874426005f22cdfe2546fd3fb2e:1591694300000',
//   prev: 'waiting'
// }

//COMPLETED
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'completed',
//   jobId: 'repeat:fetch_metrics_every_5m:f8485a81c7a28bb5636905b30910022b:1591694400000',
//   returnvalue: { status: 'job completed', result: '2020-06-09T09:20:00.173Z' }
// }

//FAILED
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'failed',
//   jobId: 'repeat:fetch_metrics_every_5m:f8485a81c7a28bb5636905b30910022b:1591694520000',
//   failedReason: 'Ошибка обработки данных...'
// }

//DELAYED
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'delayed',
//   jobId: 'repeat:fetch_metrics_every_5m:f8485a81c7a28bb5636905b30910022b:1591694700000',
//   delay: '1591694700000'
// }

//REMOVED
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'removed',
//   jobId: 'repeat:fetch_metrics_every_5m:f8485a81c7a28bb5636905b30910022b:1591695060000',
//   prev: 'TBD'
// }

//PROGRESS
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'progress',
//   jobId: 'repeat:fetch_metrics_every_5m:f8485a81c7a28bb5636905b30910022b:1591695780000',
//   data: 40
// }

//STALLED
// {
//   prefix: 'bull.demo',
//   queueName: 'fetch_metrics',
//   event: 'stalled',
//   jobId: 'repeat:fetch_metrics_every_100000:5490b874426005f22cdfe2546fd3fb2e:1591696100000'
// }

//PAUSED
// { prefix: 'bull.demo', queueName: 'fetch_metrics', event: 'paused' }

//RESUMED
// { prefix: 'bull.demo', queueName: 'fetch_metrics', event: 'resumed' }

//"cleaned" global event - TODO.

import { getAsyncIterator } from './helpers';

const asyncIter = getAsyncIterator('bull.demo', 'fetch_metrics', 'resumed', {
  typePrefix: 'Prefix',
});

async function testAsyncIt() {
  let nn = 3;
  while (true) {
    const res = await asyncIter.next();
    console.log(res);

    nn--;

    if (nn == 0) {
      await asyncIter.return();
      break;
    }
  }
}

testAsyncIt();
