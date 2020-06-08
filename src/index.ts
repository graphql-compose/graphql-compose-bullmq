export * from './composeBull';

import { getAsyncIterator } from './helpers';

const asyncIter = getAsyncIterator('bull.demo', 'fetch_metrics', 'completed', {
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
