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
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: "Categories",
            key: "id",
          },
        },
        fr: { type: Sequelize.STRING, allowNull: false },
        en: { type: Sequelize.STRING, allowNull: false },
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
          //todo insert all columns of priceguide
          {
            categoryId: 1,
            fr:
              "Nom Produit : Cartes Magic\nDescription: De magnifiques cartes de jeu qui permettent de partager un bon moment entre ami à n'importe quel endroit. Conviviales, elles permettent de découvrir des\nmoments calmes et chaleureux.\nNom Produit : Une tasse de thé\n\nDescription: Une magnifique tasse de thé qui ira parfaitement dans vos étagères, superbes pour la cuisine ! Solide, robuste, elle amène volupté et confort dans un espace familial de cuisine.\nNom Produit : un écran d'ordinateur\nDescription: Quoi de mieux qu'un écran 24 pouces pour voir mieux que quiconque vos films en HD ! Tout en affichant chaque pixel avec le plus grande profondeur, elle va au fond du film, et vous avec !\nNom Produit : Table à repasser\nDescription:",
            en:
              "Product Name : Magic Cards\nDescription: Wonderful magic cards that will give you warm time with your friend around epic strategic battles !\nProduct Name : A cup of tea\n\nDescription: This great cup of tea will give you the best moments in your kitchen. be ready to taste delightful tea in this colorful and great cup.\nProduct Name : A Computer Screen\nDescription: Did you ever try this big and great computer screen to watch your bluray movies ? It is so good !\nNom Produit : Green Glass\nDescription:",
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
