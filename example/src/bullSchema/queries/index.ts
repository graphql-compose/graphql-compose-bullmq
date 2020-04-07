import createQueues from './queues';
import createQueue from './queue';
import createJob from './job';

export default function createQueries({ QueueTC, JobTC }) {
  return {
    queues: createQueues({ QueueTC }),
    queue: createQueue({ QueueTC }),
    job: createJob({ JobTC }),
  };
}
