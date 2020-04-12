import { createQueuesFC } from './queues';
import { createQueueKeysFC } from './queueKeys';
import { createQueueFC } from './queue';
import { createJobFC } from './job';
import { SchemaComposer } from 'graphql-compose';

export function createQueryFields(sc: SchemaComposer<any>): any {
  return {
    queueKeys: createQueueKeysFC(sc),
    queues: createQueuesFC(sc),
    queue: createQueueFC(sc),
    job: createJobFC(sc),
  };
}
