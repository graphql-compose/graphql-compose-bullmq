import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Queue } from 'bullmq';
import { Options } from '../../definitions';

export function createWorkersTC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      // see https://redis.io/commands/client-list
      name: `${typePrefix}QueueWorker`,
      fields: {
        id: 'String',
        addr: 'String',
        fd: 'String',
        name: 'String',
        age: 'Int',
        idle: 'Int',
        flags: 'String',
        db: 'Int',
        sub: 'Int',
        psub: 'Int',
        multi: 'Int',
        qbuf: 'Int',
        qbufFree: 'Int',
        obl: 'Int',
        oll: 'Int',
        omem: 'Int',
        events: 'String',
        cmd: 'String',
      },
    }).List,
    args: {},
    resolve: async (queue: Queue) => {
      const workers = await queue.getWorkers();
      return workers.map((w) => ({
        ...w,
        qbufFree: w['qbuf-free'],
      }));
    },
  };
}
