export default function createQuery({ QueueTC }) {
  return {
    type: QueueTC.getTypeNonNull().getTypePlural(),
    resolve: (_, __, { Queues }) => {
      return Queues.values();
    },
  };
}
