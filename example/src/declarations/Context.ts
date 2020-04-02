import { Queue } from './Queue';

export interface Context {
  Queues: Map<string, Queue>;
}
