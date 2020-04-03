import { Queue } from 'bullmq';

export interface Context {
  Queues: Map<string, Queue>;
}
