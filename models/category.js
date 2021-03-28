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
      name: { type: DataTypes.STRING, allowNull: false },
      isShort: { type: DataTypes.INTEGER, allowNull: false },
      maxLengthTokens: { type: DataTypes.INTEGER, defaultValue: 64 },
      numberOfAIOutput: { type: DataTypes.INTEGER, defaultValue: 5 },
      engine: { type: DataTypes.STRING, defaultValue: "davinci" },
      temperature: { type: DataTypes.INTEGER, defaultValue: 0.7 },
      numberOfUserInputs: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      modelName: "Category",
    }
  );
  return Category;
};
