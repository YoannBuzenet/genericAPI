"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Theme extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Theme.belongsTo(models.Category, { foreignKey: "categoryId" });
      Theme.hasMany(models.Snippet, { foreignKey: "themeId" });
    }
  }
  Theme.init(
    {
      fr: {
        type: DataTypes.STRING,
      },
      en: {
        type: DataTypes.STRING,
      },
      categoryId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Theme",
    }
  );
  return Theme;
};
