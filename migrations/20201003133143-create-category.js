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
          //todo insert all columns of priceguide
          {
            name: "productDescription",
            isShort: 1,
            maxLengthTokens: 80,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "productDescription",
            isShort: 0,
            maxLengthTokens: 120,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "blogTitle",
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
