export default function ({ schemaComposer }) {
  const StatusEnumTC = schemaComposer.createEnumTC({
    name: 'StatusEnum',
    values: {
      COMPLETED: { value: 'completed' },
      WAITING: { value: 'waiting' },
      ACTIVE: { value: 'active' },
      DELAYED: { value: 'delayed' },
      FAILED: { value: 'failed' },
      PAUSED: { value: 'paused' }, //TODO: в bull написано что устарело, теперь все waiting
    },
  });

  return {
    StatusEnumTC,
  };
}
