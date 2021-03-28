"use strict";
const { Model } = require("sequelize");
const hashingFunctions = require("../services/hashingFunctions");

module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Company.hasMany(models.User, { foreignKey: "idCompany" });
    }
  }
  Company.init(
    {
      legalName: { type: DataTypes.STRING, allowNull: false },
      legalAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      PostalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      Town: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      VAT: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Company",
    }
  );
  return Company;
};
