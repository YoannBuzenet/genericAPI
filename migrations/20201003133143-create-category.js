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
        numberOfAIOutput: { type: Sequelize.INTEGER, defaultValue: 5 },
        engine: { type: Sequelize.STRING, defaultValue: "currie" },
        numberOfUserInputs: { type: Sequelize.INTEGER },
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
            name: "Product Description",
            isShort: 1,
            engine: "currie",
            maxLengthTokens: 120,
            numberOfUserInputs: 1,
            numberOfAIOutput: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Value Proposition",
            isShort: 1,
            maxLengthTokens: 200,
            engine: "currie",
            numberOfUserInputs: 2,
            numberOfAIOutput: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Title",
            isShort: 1,
            maxLengthTokens: 100,
            engine: "currie",
            numberOfUserInputs: 1,
            numberOfAIOutput: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Instagram Caption",
            isShort: 1,
            maxLengthTokens: 100,
            engine: "currie",
            numberOfUserInputs: 1,
            numberOfAIOutput: 5,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Intro",
            isShort: 1,
            engine: "currie",
            maxLengthTokens: 150,
            numberOfUserInputs: 1,
            numberOfAIOutput: 5,
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
