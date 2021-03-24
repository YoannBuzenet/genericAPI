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
            name: "Generic",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "AdditionalDescription",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
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
            name: "Technology",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Generic",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "AdditionalDescription",
            categoryId: 2,
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
