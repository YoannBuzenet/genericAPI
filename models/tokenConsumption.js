"use strict";
const { Model } = require("sequelize");
const hashingFunctions = require("../services/hashingFunctions");

module.exports = (sequelize, DataTypes) => {
  class TokenConsumption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TokenConsumption.belongsToMany(models.User, { foreignKey: "userID" });
      TokenConsumption.belongsToMany(models.Company, {
        foreignKey: "companyID",
      });
    }
  }
  TokenConsumption.init(
    {
      legalName: { type: DataTypes.STRING, allowNull: false },
      companyID: {
        type: DataTypes.INTEGER,
      },
      userID: {
        type: DataTypes.INTEGER,
      },
      month: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      numberOfTokenUsed: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TokenConsumption",
    }
  );
  return TokenConsumption;
};
