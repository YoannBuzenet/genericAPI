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
            name: "ShortProductDescription",
            isShort: 1,
            maxLengthTokens: 80,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "LongProductDescription",
            isShort: 0,
            maxLengthTokens: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "BlogTitle",
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
