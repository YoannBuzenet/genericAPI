"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Snippets", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: "Categories",
            key: "id",
          },
        },
        fr: { type: Sequelize.STRING(1900), allowNull: false },
        en: { type: Sequelize.STRING(1900), allowNull: false },
        isDefault: {
          type: Sequelize.INTEGER,
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
        queryInterface.bulkInsert("Snippets", [
          // Product description generic
          {
            categoryId: 1,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // value proposition generic
          {
            categoryId: 2,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // blog title - generic
          {
            categoryId: 3,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Blog Intro Generic
          {
            categoryId: 4,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          // Facebook Ads to UPDATE
          {
            categoryId: 5,
            isDefault: 1,
            fr: "",
            en: "",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Snippets");
  },
};
