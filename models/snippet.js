"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: "idShop" });
      User.hasMany(models.Invoice, { foreignKey: "idShop" });
    }
  }
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        validate: { isNumeric: true },
      },
      fr: {
        type: DataTypes.STRING,
      },
      en: {
        type: DataTypes.STRING,
      },
      category: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
