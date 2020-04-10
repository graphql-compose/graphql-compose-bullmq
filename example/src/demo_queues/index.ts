import { Queue } from 'bullmq';
import fetchMetrics from './fetchMetrics';

export const Queues = new Map<string, Queue>();

Queues.set(fetchMetrics.name, fetchMetrics.bullQueue);
