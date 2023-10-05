"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Articles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Articles.belongsTo(models.User, {
        foreignKey: "user_uuid",
        as: "user",
      });
      Articles.belongsTo(models.File, {
        foreignKey: "thumbnail_uuid",
        as: "thumbnail",
      });
    }
  }
  Articles.init(
    {
      uuid: {
        primaryKey: true,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
      },
      user_uuid: { type: DataTypes.UUID, allowNull: false },
      thumbnail_uuid: { type: DataTypes.UUID, allowNull: false },
      title: { type: DataTypes.STRING, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      view: { type: DataTypes.INTEGER, allowNull: false },
      created_at: { type: DataTypes.DATE },
      updated_at: { type: DataTypes.DATE },
    },
    {
      sequelize,
      createdAt: "created_at",
      updatedAt: "updated_at",
      tableName: "articles",
      modelName: "Articles",
    }
  );
  return Articles;
};
