const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const [postTypeDefs, postResolver] = require("./schemas/postSchema");
const [userTypeDefs, userResolver] = require("./schemas/userSchema");

const server = new ApolloServer({
  typeDefs: [postTypeDefs, userTypeDefs],
  resolvers: [postResolver, userResolver],
  introspection: true,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at: ${url}`);
});
