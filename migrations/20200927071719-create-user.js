"use strict";
require("dotenv").config();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      fullName: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      provider: { type: Sequelize.STRING },
      googleId: { type: Sequelize.INTEGER },
      googleAccessToken: { type: Sequelize.STRING(300) },
      googleRefreshToken: { type: Sequelize.STRING(500) },
      accesstokenExpirationDate: { type: Sequelize.STRING },
      avatar: { type: Sequelize.STRING },
      userLocale: { type: Sequelize.STRING },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      isSubscribedUntil: {
        type: Sequelize.DATEONLY,
      },
      temporarySecret: {
        type: Sequelize.STRING,
      },
      temporaryLastProductPaid: {
        type: Sequelize.STRING,
      },
      hasAlreadyConnected: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      temporaryChallenge: {
        type: Sequelize.STRING,
      },
      rightsFrontWebApp: {
        type: Sequelize.INTEGER,
        references: {
          model: "UserRights",
          key: "id",
        },
      },
      rightsCentralAPI: {
        type: Sequelize.INTEGER,
        references: {
          model: "UserRights",
          key: "id",
        },
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
    await queryInterface.dropTable("Users");
  },
};
