const Sequelize = require("sequelize");
const Op = Sequelize.Op;

("use strict");
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
      Snippet.belongsToMany(models.Attribute, {
        through: models.SnippetAttribute,
        foreignKey: "snippet_id",
      });
    }

    static getSnippetByCategoryID(categoryID) {
      return Snippet.findOne({
        where: { categoryId: categoryID },
      });
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
      isDefault: {
        type: DataTypes.INTEGER,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Value of IsDefault prop must be 0 or 1.",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Snippet",
    }
  );
  return Snippet;
};
