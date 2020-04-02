import { Queue as BullQueue } from 'bullmq';

export interface Queue {
  name: string;
  hostId: string;
  prefix: string;
  bullQueue: BullQueue;
  jobNames: string[];
}
