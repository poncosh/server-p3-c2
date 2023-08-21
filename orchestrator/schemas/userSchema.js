const axiosUsers = require("../utils/axiosUser");
const redis = require("../config/ioredis");

const typeDefs = `#graphql
  type User {
    _id: String
    username: String
    email: String
  }

  type Query {
    getUser(UserMongoId: String): User
  }
`;

const resolvers = {
  Query: {
    getUser: async (_, args) => {
      try {
        const userCache = await redis.get("app:user");
        if (userCache) {
          const user = JSON.parse(userCache);
          return user;
        } else {
          const { UserMongoId } = args;

          const { data: user } = await axiosUsers.get(`/${UserMongoId}`);

          await redis.del("app:user");
          return user;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = [typeDefs, resolvers];
