import { createQueuesFC } from './queues';
import { createQueueFC } from './queue';
import { createJobFC } from './job';
import { SchemaComposer } from 'graphql-compose';

export function createQueryFields(schemaComposer: SchemaComposer<any>): any {
  return {
    queues: createQueuesFC(schemaComposer),
    queue: createQueueFC(schemaComposer),
    job: createJobFC(schemaComposer),
  };
}
