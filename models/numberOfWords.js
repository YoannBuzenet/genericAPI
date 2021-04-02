"use strict";
const { Model } = require("sequelize");

// Specific function definition to handle UTC more easily
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

module.exports = (sequelize, DataTypes) => {
  class NumberOfWords extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      NumberOfWords.belongsTo(models.User, { foreignKey: "user_id" });
    }
    static async addNumberOfWordsToday(userID, numberOfWordsToAdd) {
      // TODO
      //check if exist, if no exist, on UTC

      const resultWordsToday = await NumberOfWords.findOne({
        where: { user_id: userID },
      });

      const wordsToday =
        resultWordsToday.dataValues.amount + numberOfWordsToAdd;

      resultWordsToday.amount = wordsToday;

      return resultWordsToday.save();
    }
  }
  NumberOfWords.init(
    {
      user_id: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      date: {
        allowNull: false,
        type: DataTypes.DATEONLY,
      },
      amount: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "NumberOfWords",
    }
  );
  return NumberOfWords;
};
