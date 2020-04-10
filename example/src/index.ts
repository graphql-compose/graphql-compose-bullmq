import { ApolloServer } from 'apollo-server';
import { Queues } from './demo_queues';
import schema from './schema';

const server = new ApolloServer({
  schema,
  context: () => {
    return { Queues };
  },
});

server.listen(5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Server pid: ${process.pid}`);
});
