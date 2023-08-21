"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      this.belongsTo(models.Post, { foreignKey: "postId" });
    }
  }
  Tag.init(
    {
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Post ID cannot be null",
          },
          notEmpty: {
            msg: "Post ID cannot be empty",
          },
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: "Tag name cannot be null",
          },
          notEmpty: {
            msg: "Tag name cannot be empty",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Tag",
    }
  );
  return Tag;
};
