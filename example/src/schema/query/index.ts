import { createQueuesFC } from './queues';
import { createQueueFC } from './queue';
import { createJobFC } from './job';

export function createQueryFields({ QueueTC, JobTC }): any {
  return {
    queues: createQueuesFC({ QueueTC }),
    queue: createQueueFC({ QueueTC }),
    job: createJobFC({ JobTC }),
  };
}
