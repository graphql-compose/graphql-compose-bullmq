import { SchemaComposer } from 'graphql-compose';
import { Queue } from 'bullmq';

export function createWorkersTC(schemaComposer: SchemaComposer<any>) {
  return {
    type: schemaComposer
      .createObjectTC({
        //https://redis.io/commands/client-list
        name: 'QueueWorker',
        fields: {
          clientId: 'String',
          addr: 'String',
          fileDescr: 'String',
          name: 'String',
          age: 'Int',
          idle: 'Int',
          clientFlags: 'String',
          dbId: 'Int',
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
      })
      .getTypePlural(),
    args: {},
    resolve: async (queue: Queue) => {
      const workers = await queue.getWorkers();
      return workers.map((worker) => ({
        clientId: worker.id,
        addr: worker.addr,
        fileDescr: worker.fd,
        name: worker.name,
        age: worker.age,
        idle: worker.idle,
        clientFlags: worker.flags,
        dbId: worker.db,
        sub: worker.sub,
        psub: worker.psub,
        multi: worker.multi,
        qbuf: worker.qbuf,
        qbufFree: worker['qbuf-free'],
        obl: worker.obl,
        oll: worker.id,
        omem: worker.omem,
        events: worker.events,
        cmd: worker.cmd,
      }));
    },
  };
}
