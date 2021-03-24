"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SnippetAttributes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SnippetAttributes.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      SnippetAttributes.belongsTo(models.Snippet, {
        foreignKey: "snippetId",
      });
    }
  }
  SnippetAttributes.init(
    {
      fr: {
        type: DataTypes.STRING,
      },
      en: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.INTEGER,
      },
      snippetId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "SnippetAttributes",
    }
  );
  return SnippetAttributes;
};
