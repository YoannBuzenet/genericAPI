"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Attributes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Categories",
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
      })
      .then(function () {
        queryInterface.bulkInsert("Attributes", [
          {
            name: "Target Audience",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Occasion",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Promotion",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Target Audience",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Company Activity",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Mood",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Mood",
            categoryId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Place",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Mood",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Promotion",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Mood",
            categoryId: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Attributes");
  },
};
