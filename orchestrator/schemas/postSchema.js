const axiosProducts = require("../utils/axiosProducts");
const redis = require("../config/ioredis");

const typeDefs = `#graphql
  type Tag {
    id: ID
    postId: Int
    name: String
    createdAt: String
    updatedAt: String
  }

  type Category {
    id: ID
    name: String
    createdAt: String
    updatedAt: String
  }

  type Post {
    id: ID
    title: String
    slug: String
    content: String
    imgUrl: String
    categoryId: Int
    UserMongoId: String
    createdAt: String
    updatedAt: String
    Tags: [Tag]
    Category: Category
  }

  type Query {
    getPosts: [Post]
    getPostBySlug(slug: String): Post
  }

  input RawTag {
    name: String
  }

  input PostData {
    title: String
    content: String
    imgUrl: String
    categoryId: Int
    tags: [RawTag]
  }

  type Mutation {
    addPost(data: PostData): String
    deletePost(postId: Int): String
  }
`;

const resolvers = {
  Query: {
    getPosts: async () => {
      try {
        const productCache = await redis.get("app:products");
        if (productCache) {
          const data = JSON.parse(productCache);
          return data;
        } else {
          const { data: posts } = await axiosProducts.get("/admin/posts");

          await redis.set(
            "app:products",
            JSON.stringify(posts.data),
            "EX",
            86400
          );
          return posts.data;
        }
      } catch (error) {
        console.log(error);
      }
    },
    getPostBySlug: async (_, args) => {
      try {
        const { slug } = args;

        const productCache = await redis.get(`app:product${slug}`);
        if (productCache) {
          const data = JSON.parse(productCache);
          return data;
        } else {
          const { data: post } = await axiosProducts.get(
            `/client/details/${slug}`
          );

          if (!post) throw { name: "NotFound" };

          await redis.set(
            `app:products${slug}`,
            JSON.stringify(post),
            "EX",
            86400
          );

          return post;
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
  Mutation: {
    addPost: async (_, args) => {
      try {
        const { title, content, imgUrl, categoryId, tags } = args.data;

        await axiosProducts.post("/admin/posts", {
          title,
          content,
          imgUrl,
          categoryId,
          tags,
        });

        await redis.del("app:products");
        return `Success adding new post ${title}`;
      } catch (error) {
        throw error;
      }
    },
    deletePost: async (_, args) => {
      try {
        const { postId } = args;

        await axiosProducts.delete(`admin/posts/${postId}`);

        await redis.del("app:products");
        return `Success deleting post ${postId}`;
      } catch (error) {
        console.log(error);
      }
    },
  },
};

module.exports = [typeDefs, resolvers];
