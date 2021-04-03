"use strict";
// const db = require("../models/index");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      "NumberOfWords",
      [
        {
          user_id: 1,
          date: "2021-04-01",
          amount: 42,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          user_id: 1,
          date: "2021-04-02",
          amount: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("NumberOfWords", null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
