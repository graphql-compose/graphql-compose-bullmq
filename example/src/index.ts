import { ApolloServer } from 'apollo-server';
import { Queues } from './demo_queues';
import schema from './schema';

const server = new ApolloServer({
  schema,
  context: () => {
    return { Queues };
  },
  subscriptions: {
    path: '/',
  },
});

server.listen(process.env.PORT || 5000).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 WebSocket ready at ${url.replace(/^http/i, 'ws')}`);
  console.log(`🚀 Server pid: ${process.pid}`);
});
