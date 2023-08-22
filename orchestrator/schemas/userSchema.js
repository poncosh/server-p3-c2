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

  input PostUser {
    username: String
    email: String
    password: String
    phoneNumber: String
    address: String
  }
  
  type Mutation {
    addUser(data: PostUser): String
    deleteUser(UserMongoId: String): String
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
  Mutation: {
    addUser: async (_, args) => {
      try {
        const { username, email, password, phoneNumber, address } = args.data;

        await axiosUsers.post("/register", {
          username,
          email,
          password,
          phoneNumber,
          address,
        });

        return `Success adding new user ${username}`;
      } catch (error) {
        console.log(error);
      }
    },
    deleteUser: async (_, args) => {
      try {
        const { UserMongoId } = args;
        const userCache = await redis.get(`app:user${UserMongoId}`);

        if (userCache) {
          await redis.del(`app:user${UserMongoId}`);
          await axiosUsers.delete(`/${UserMongoId}`);
          return `Success deleting user with id ${UserMongoId}`;
        } else {
          await axiosUsers.delete(`/${UserMongoId}`);
          return `Success deleting user with id ${UserMongoId}`;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = [typeDefs, resolvers];
