import fetchMetrics from './fetchMetrics';

const Queues = new Map();
Queues.set(fetchMetrics.name, fetchMetrics);

export {
  Queues,
  //TODO: ...
};
