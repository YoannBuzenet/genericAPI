"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Snippet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Snippet.belongsTo(models.Category, { foreignKey: "categoryId" });
      Snippet.hasMany(models.SnippetAttribute, { foreignKey: "snippetId" });
    }
  }
  Snippet.init(
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
    },
    {
      sequelize,
      modelName: "Snippet",
    }
  );
  return Snippet;
};
