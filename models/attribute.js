("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Attribute extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attribute.belongsTo(models.Category, {
        foreignKey: "categoryId",
      });
      Attribute.belongsToMany(models.Snippet, {
        through: models.SnippetAttribute,
        foreignKey: "attribute_id",
      });
    }
  }
  Attribute.init(
    {
      categoryId: {
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Attribute",
    }
  );
  return Attribute;
};
