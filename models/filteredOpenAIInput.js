"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

// Specific function definition to handle UTC more easily
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

module.exports = (sequelize, DataTypes) => {
  class FilteredOpenAIInput extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      FilteredOpenAIInput.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  FilteredOpenAIInput.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      wordsFiltered: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      numberOfOutputsFiltered: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      wasFullyFiltered: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "FilteredOpenAIInput",
    }
  );
  return FilteredOpenAIInput;
};
