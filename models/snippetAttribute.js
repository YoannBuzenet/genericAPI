"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SnippetAttribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SnippetAttribute.init(
    {
      snippet_id: {
        type: DataTypes.INTEGER,
        validate: { isNumeric: true },
        allowNull: false,
      },
      attribute_id: {
        type: DataTypes.INTEGER,
        validate: { isNumeric: true },
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SnippetAttribute",
    }
  );
  return SnippetAttribute;
};
