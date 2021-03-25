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
            name: "targetAudience",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "occasion",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "promotion",
            categoryId: 1,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "targetAudience",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "companyActivity",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "mood",
            categoryId: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "mood",
            categoryId: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "place",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "mood",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "promotion",
            categoryId: 4,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "mood",
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
