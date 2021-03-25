"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface
      .createTable("Categories", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        name: { type: Sequelize.STRING, allowNull: false },
        isShort: { type: Sequelize.INTEGER, allowNull: false },
        maxLengthTokens: { type: Sequelize.INTEGER, defaultValue: 64 },
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
        queryInterface.bulkInsert("Categories", [
          {
            name: "Short Product Description",
            isShort: 1,
            maxLengthTokens: 80,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Value Proposition",
            isShort: 1,
            maxLengthTokens: 80,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Title",
            isShort: 1,
            maxLengthTokens: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Instagram Caption",
            isShort: 1,
            maxLengthTokens: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Idea",
            isShort: 1,
            maxLengthTokens: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Intro",
            isShort: 1,
            maxLengthTokens: 30,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Categories");
  },
};
