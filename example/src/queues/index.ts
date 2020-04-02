import fetchMetrics from './fetchMetrics';
import { Queue } from '../declarations';

export const Queues = new Map<string, Queue>();

Queues.set(fetchMetrics.name, fetchMetrics);
