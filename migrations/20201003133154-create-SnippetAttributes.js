module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable("SnippetAttributes", {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER,
        },
        snippet_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "Snippets",
            key: "id",
          },
        },
        attribute_id: {
          type: Sequelize.INTEGER,
          references: {
            model: "Attributes",
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
        queryInterface.bulkInsert("SnippetAttributes", [
          {
            snippet_id: 1,
            attribute_id: 2,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ]);
      });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("SnippetAttributes");
  },
};
