const { Category, Post, Tag, sequelize } = require("../models");

// const register = async (req, res, next) => {
//   try {
//     const { username, email, password, phoneNumber, address } = req.body;

//     const existedEmail = await User.findOne({
//       where: {
//         email: email,
//       },
//     });

//     const existedUsername = await User.findOne({
//       where: {
//         username: username,
//       },
//     });

//     if (existedEmail || existedUsername) {
//       throw { name: "ExistedData" };
//     }

//     const newUser = await User.create({
//       username,
//       email,
//       password,
//       role: "Admin",
//       phoneNumber,
//       address,
//     });

//     res.status(201).json({
//       message: `Created new user with email ${email}`,
//       data: {
//         username: newUser.username,
//         email: newUser.email,
//       },
//     });
//   } catch (error) {
//     next(error);
//   }
// };

// const login = async (req, res, next) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });

//     if (!user) {
//       throw { name: "InvalidEmail" };
//     }

//     const trueUser = user.comparePassword(password);

//     if (!trueUser) {
//       throw { name: "InvalidPassword" };
//     }

//     const accessToken = signToken(user);

//     res.status(200).json({
//       access_token: accessToken,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

const readCategory = async (req, res, next) => {
  try {
    const categories = await Category.findAndCountAll();

    res.status(200).json({
      total: categories.count,
      data: categories.rows,
    });
  } catch (error) {
    next(error);
  }
};

const postCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const newCategory = await Category.create({
      name,
    });

    res.status(201).json({
      message: `Category with name ${newCategory.name} has been created`,
    });
  } catch (error) {
    next(error);
  }
};

const putCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw { name: "NotFound" };
    }

    const editedCategory = await Category.update(
      {
        name,
      },
      {
        where: {
          id: categoryId,
        },
      }
    );

    res.status(200).json({
      message: `Success edit category from ${category.name} to ${editedCategory.name}`,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findByPk(categoryId);

    if (!category) {
      throw { name: "NotFound" };
    }

    await category.destroy();

    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

const readPost = async (req, res, next) => {
  try {
    const posts = await Post.findAndCountAll({
      include: [{ model: Tag }, { model: Category }],
    });

    res.status(200).json({
      total: posts.count,
      data: posts.rows,
    });
  } catch (error) {
    next(error);
  }
};

const postPost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { title, content, imgUrl, categoryId, tags } = req.body;

    const data = await Post.findOne(
      {
        where: {
          title: title,
        },
      },
      {
        transaction: t,
      }
    );

    if (data) {
      throw { name: "InvalidPost" };
    }

    if (tags.length > 3) {
      throw { name: "InvalidPost" };
    }

    const newPost = await Post.create(
      {
        title,
        content,
        imgUrl,
        categoryId,
        UserMongoId: "64dca3a65e881429c9f4d9a8",
      },
      {
        transaction: t,
      }
    );

    if (tags.length === 0) {
      await t.commit();
      return res.status(201).json({
        message: "Successfully created new post",
        data: {
          title: newPost.title,
        },
      });
    }

    const newTags = tags
      .map((el) => (el.name !== "" ? { name: el.name } : false))
      .filter((el) => el !== false);

    newTags.forEach((el) => {
      el.postId = newPost.id;
    });

    await Tag.bulkCreate(newTags, {
      transaction: t,
    });

    await t.commit();
    return res.status(201).json({
      message: "Successfully created new post",
      data: {
        title: newPost.title,
      },
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const putPost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { title, content, imgUrl, categoryId, tags } = req.body;
    const { postId } = req.params;

    const data = await Post.findByPk(postId, {
      transaction: t,
    });

    if (!data) {
      throw { name: "NotFound" };
    }

    if (tags.length > 3) {
      throw { name: "InvalidEdit" };
    }

    await Post.update(
      {
        title,
        content,
        imgUrl,
        categoryId,
      },
      {
        where: {
          id: postId,
        },
        transaction: t,
      }
    );

    const newTags = tags
      .map((el) => (el.name !== "" ? { name: el.name } : false))
      .filter((el) => el !== false);

    const dataTags = await Tag.findAll({
      where: {
        postId: postId,
      },
      raw: true,
      transaction: t,
    });

    if (dataTags.length === newTags.length) {
      await Promise.all(
        dataTags.map(async (el, i) => {
          await Tag.update(
            {
              name: newTags[i].name,
            },
            {
              where: {
                id: el.id,
              },
              transaction: t,
            }
          );
        })
      );

      await t.commit();
      return res.status(200).json({
        message: "Successfully edited requested post",
      });
    }

    await Tag.destroy({
      where: {
        postId: postId,
      },
      transaction: t,
    });

    if (newTags.length === 0) {
      await t.commit();
      return res.status(200).json({
        message: "Successfully edited requested post",
      });
    }

    newTags.forEach((el) => {
      el.postId = postId;
    });

    await Tag.bulkCreate(newTags, {
      transaction: t,
    });

    await t.commit();
    return res.status(200).json({
      message: "Successfully edited requested post",
    });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { postId } = req.params;

    const willDeletePost = await Post.findByPk(postId, {
      transaction: t,
    });

    if (!willDeletePost) {
      throw { name: "NotFound" };
    }

    await Tag.destroy({
      where: {
        postId: postId,
      },
      transaction: t,
    });

    await Post.destroy({
      where: {
        id: postId,
      },
      transaction: t,
    });

    await t.commit();
    res.sendStatus(204);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

module.exports = {
  readCategory,
  postCategory,
  putCategory,
  deleteCategory,
  readPost,
  postPost,
  putPost,
  deletePost,
};
