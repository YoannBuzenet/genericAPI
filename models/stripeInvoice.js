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
  class StripeInvoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  StripeInvoice.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
      },
      billing_reason: {
        type: DataTypes.STRING,
      },
      customer_email: {
        type: DataTypes.STRING,
      },
      customerStripeId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_country: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
      },
      subscription: {
        type: DataTypes.STRING,
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StripeInvoice",
    }
  );
  return StripeInvoice;
};
