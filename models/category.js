"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Snippet, { foreignKey: "categoryId" });
    }
  }
  Category.init(
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        validate: { isNumeric: true },
      },
      name: { type: DataTypes.STRING, allowNull: false },
      isShort: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
