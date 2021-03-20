"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User, { foreignKey: "idShop" });
    }
  }
  Order.init(
    {
      idUser: {
        type: DataTypes.INTEGER,
        validate: { isNumeric: true },
        allowNull: false,
      },
      idInvoice: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: false,
      },
      userName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userAddress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userPostalCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userTown: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userVAT: {
        type: DataTypes.STRING,
      },
      productName: {
        //For now, an invoice can contain only one product. TODO next step : product table and N-N relation
        type: DataTypes.STRING,
        allowNull: false,
      },
      subscribingStartDate: {
        type: DataTypes.DATEONLY,
      },
      subscribingEndDate: {
        type: DataTypes.DATEONLY,
      },
      amountTaxIncluded: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      amountTaxExcluded: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      VATSum: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      VATStatus: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "Order",
    }
  );
  return Order;
};
