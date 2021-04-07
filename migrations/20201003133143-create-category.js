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
        engine: { type: Sequelize.STRING, defaultValue: "davinci" },
        temperature: { type: Sequelize.INTEGER, defaultValue: 0.7 },
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
            maxLengthTokens: 50,
            numberOfUserInputs: 1,
            numberOfAIOutput: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Value Proposition",
            isShort: 1,
            temperature: 0.7,
            maxLengthTokens: 100,
            engine: "currie",
            numberOfUserInputs: 2,
            numberOfAIOutput: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Title",
            isShort: 1,
            maxLengthTokens: 100,
            temperature: 0.9,
            engine: "currie",
            numberOfUserInputs: 1,
            temperature: 1,
            numberOfAIOutput: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Blog Intro",
            isShort: 1,
            engine: "currie",
            temperature: 0.9,
            maxLengthTokens: 100,
            numberOfUserInputs: 1,
            numberOfAIOutput: 3,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            name: "Facebook Ads headline",
            isShort: 1,
            engine: "currie",
            temperature: 0.9,
            maxLengthTokens: 50,
            numberOfUserInputs: 1,
            numberOfAIOutput: 3,
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
