"use strict";
require("dotenv").config();
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("UserRights", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING },
        level: { type: Sequelize.INTEGER },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      })
      .then(function () {
        queryInterface.bulkInsert("UserRights", [
          {
            name: "Public Level",
            level: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Register Level",
            level: 10,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Content Generator",
            level: 20,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Content Editor",
            level: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "User Support",
            level: 50,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "User Management",
            level: 60,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Super Admin",
            level: 100,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("UserRights");
  },
};
