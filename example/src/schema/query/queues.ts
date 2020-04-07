export function createQueuesFC({ QueueTC }) {
  return {
    type: QueueTC.getTypeNonNull().getTypePlural(),
    resolve: (_, __, { Queues }) => {
      return Queues.values();
    },
  };
}
