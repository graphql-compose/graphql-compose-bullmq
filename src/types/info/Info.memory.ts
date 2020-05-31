import { SchemaComposer, ObjectTypeComposerFieldConfigDefinition } from 'graphql-compose';
import { Options } from '../../definitions';
import { getBullConnection } from '../../helpers/getBullConnection';

export function createMemoryFC(
  sc: SchemaComposer<any>,
  opts: Options
): ObjectTypeComposerFieldConfigDefinition<any, any> {
  const { typePrefix } = opts;

  return {
    type: sc.createObjectTC({
      name: `${typePrefix}InfoMemory`,
      fields: {
        used_memory: 'String',
        used_memory_human: 'String',
        used_memory_rss: 'String',
        used_memory_rss_human: 'String',
        used_memory_peak: 'String',
        used_memory_peak_human: 'String',
        used_memory_peak_perc: 'String',
        used_memory_overhead: 'String',
        used_memory_startup: 'String',
        used_memory_dataset: 'String',
        used_memory_dataset_perc: 'String',
        allocator_allocated: 'String',
        allocator_active: 'String',
        allocator_resident: 'String',
        total_system_memory: 'String',
        total_system_memory_human: 'String',
        used_memory_lua: 'String',
        used_memory_lua_human: 'String',
        used_memory_scripts: 'String',
        used_memory_scripts_human: 'String',
        number_of_cached_scripts: 'String',
        maxmemory: 'String',
        maxmemory_human: 'String',
        maxmemory_policy: 'String',
        allocator_frag_ratio: 'String',
        allocator_frag_bytes: 'String',
        allocator_rss_ratio: 'String',
        allocator_rss_bytes: 'String',
        rss_overhead_ratio: 'String',
        rss_overhead_bytes: 'String',
        mem_fragmentation_ratio: 'String',
        mem_fragmentation_bytes: 'String',
        mem_not_counted_for_evict: 'String',
        mem_replication_backlog: 'String',
        mem_clients_slaves: 'String',
        mem_clients_normal: 'String',
        mem_aof_buffer: 'String',
        mem_allocator: 'String',
        active_defrag_running: 'String',
        lazyfree_pending_objects: 'String',
      },
    }),
    resolve: async () => {
      const redis = getBullConnection(opts);
      const memoryInfo = await redis.info('memory');
      return memoryInfo
        .split('\r\n')
        .filter((item) => item.includes(':'))
        .map((item) => item.split(':'))
        .reduce((acc, metric) => ({ ...acc, [metric[0]]: metric[1] }), {});
    },
  };
}
