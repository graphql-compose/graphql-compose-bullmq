import { Queue } from 'bullmq';

//TODO: Потом заюзать:
export interface Context {
  Queues: Map<string, Queue>;
  [key: string]: any;
}
