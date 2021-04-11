"use strict";
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("StripeInvoices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
      },
      billing_reason: {
        type: Sequelize.STRING,
      },
      customer_email: {
        type: Sequelize.STRING,
      },
      customerStripeId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      account_country: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      subscription: {
        type: Sequelize.STRING,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("StripeInvoices");
  },
};
