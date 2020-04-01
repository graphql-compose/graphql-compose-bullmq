import { ApolloServer } from 'apollo-server';

const typeDefs = `
  type Query {
    hello: String
  }
`;

const resolvers = {
  Query: {
    hello: () => 'world',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen(5000).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
