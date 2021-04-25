"use strict";
require("dotenv").config();
const { BASE_WORDS_SUBSCRIPTION } = require("../config/settings");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CallToServices", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      isUserSubscribedForThisCall: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      isUserOnCompanyAccessForThisCall: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      categoryUsed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      locale: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("CallToServices");
  },
};
