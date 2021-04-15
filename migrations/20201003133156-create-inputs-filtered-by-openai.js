module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("FilteredOpenAIInputs", {
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
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      wordsFiltered: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      numberOfOutputsFiltered: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      wasFullyFiltered: {
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
    return queryInterface.dropTable("FilteredOpenAIInputs");
  },
};
