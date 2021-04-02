"use strict";
const { Model } = require("sequelize");

// Specific function definition to handle UTC more easily
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

module.exports = (sequelize, DataTypes) => {
  class NumberOfWords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NumberOfWords.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  NumberOfWords.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      month: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "NumberOfWords",
    }
  );
  return NumberOfWords;
};
