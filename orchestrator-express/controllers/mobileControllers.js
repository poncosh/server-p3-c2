const axiosProducts = require("../utils/axiosProducts");
const redis = require("../config/ioredis");
const mapUsers = require("../helpers/mapUsers");
const axiosUsers = require("../utils/axiosUser");

const getPosts = async (req, res, next) => {
  try {
    const productCache = await redis.get("app:products");
    if (productCache) {
      const data = JSON.parse(productCache);
      res.status(200).json(data);
    } else {
      const { data } = await axiosProducts.get("/admin/posts");
      const posts = data.data;
      const mongoUserId = posts.map((el) => el.UserMongoId);
      const rawUser = await mapUsers(mongoUserId);
      const mongoUser = rawUser.map((el) => el.data);
      posts.forEach((el, idx) => {
        el.mongoUser = mongoUser[idx];
      });

      await redis.set("app:products", JSON.stringify(posts), "EX", 86400);
      res.status(200).json({
        total: data.total,
        data: posts,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const productCache = await redis.get(`app:product${postId}`);
    if (productCache) {
      const data = JSON.parse(productCache);
      res.status(200).json(data);
    } else {
      const { data: post } = await axiosProducts.get(`/client/details/${slug}`);

      if (!post) throw { name: "NotFound" };

      const { data: user } = await axiosUsers.get(`/${post.UserMongoId}`);

      post.mongoUser = user;

      await redis.set(
        `app:product${postId}`,
        JSON.stringify(post),
        "EX",
        86400
      );
      res.status(200).json(post);
    }
  } catch (error) {
    next(error);
  }
};

const postPost = async (req, res, next) => {
  try {
    const { access_token } = req.headers;
    const { title, content, imgUrl, categoryId, tags } = req.body;

    if (!access_token) {
      throw { name: "NoToken" };
    }

    const { data } = await axiosProducts.post("/admin/posts", {
      body: {
        title,
        content,
        imgUrl,
        categoryId,
        tags,
      },
      headers: {
        access_token,
      },
    });

    await redis.del("app:products");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const putPost = async (req, res, next) => {
  try {
    const { title, content, imgUrl, categoryId, tags } = req.body;
    const { postId } = req.params;
    const { access_token } = req.headers;

    const { data } = await axiosProducts.put(`/admin/posts/${postId}`, {
      body: {
        title,
        content,
        imgUrl,
        categoryId,
        tags,
      },
      headers: {
        access_token,
      },
    });

    await redis.del("app:products");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { access_token } = req.headers;

    const { data } = await axiosProducts.delete(`/admin/posts/${postId}`, {
      headers: {
        access_token,
      },
    });

    await redis.del("app:products");
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getPosts, getDetail, postPost, putPost, deletePost };
