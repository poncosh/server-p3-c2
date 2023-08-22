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
        const { UserMongoId } = args;
        const userCache = await redis.get(`app:user${UserMongoId}`);
        if (userCache) {
          const user = JSON.parse(userCache);
          return user;
        } else {
          const { data: user } = await axiosUsers.get(`/${UserMongoId}`);

          await redis.set(
            `app:user${UserMongoId}`,
            JSON.stringify(user),
            "EX",
            86400
          );
          return user;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = [typeDefs, resolvers];
