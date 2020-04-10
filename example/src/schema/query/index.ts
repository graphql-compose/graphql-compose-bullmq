import { createQueuesFC } from './queues';
import { createQueueKeysFC } from './queueKeys';
import { createQueueFC } from './queue';
import { createJobFC } from './job';
import { SchemaComposer } from 'graphql-compose';

export function createQueryFields(schemaComposer: SchemaComposer<any>): any {
  return {
    queueKeys: createQueueKeysFC(schemaComposer),
    queues: createQueuesFC(schemaComposer),
    queue: createQueueFC(schemaComposer),
    job: createJobFC(schemaComposer),
  };
}
