module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("NumberOfWords", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "Users",
          key: "id",
        },
      },
      month: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // .then(function () {
    //   queryInterface.bulkInsert("SnippetAttributes", [

    //   ]);
    // });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("NumberOfWords");
  },
};
