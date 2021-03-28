"use strict";
require("dotenv").config();

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Companies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      legalName: { type: Sequelize.STRING, allowNull: false },
      legalAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      PostalCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      Town: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      VAT: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("Companies");
  },
};
