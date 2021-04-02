"use strict";
const { Model } = require("sequelize");
const {
  getNowInUTC,
  getStartOfTheDayInUTC,
  getDays7DaysFromNowInUTC,
} = require("../services/utils");
const Op = Sequelize.Op;

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
      const nowInUTC = getNowInUTC();
      const startOfTheDayUTC = getStartOfTheDayInUTC();

      const resultWordsToday = await NumberOfWords.findOne({
        where: {
          user_id: userID,
          date: {
            [Op.gt]: startOfTheDayUTC,
            [Op.lt]: nowInUTC,
          },
        },
      });

      // If it doesnt exist, we create it
      if (resultWordsToday === null) {
        return NumberOfWords.create({
          user_id: userID,
          date: nowInUTC,
          amount: numberOfWordsToAdd,
        });
      }
      // If it exists, we just update it
      else {
        const wordsToday =
          resultWordsToday.dataValues.amount + numberOfWordsToAdd;

        resultWordsToday.amount = wordsToday;

        return resultWordsToday.save();
      }
    }

    static async getWordsOfLastSevenDays(userID) {
      const date7DaysFromNow = getDays7DaysFromNowInUTC();
      const nowInUTC = getNowInUTC();

      const resultWords7Days = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gt]: date7DaysFromNow,
            [Op.lt]: nowInUTC,
          },
        },
      });

      console.log("ok", resultWords7Days);
      return resultWords7Days;
    }
    static async getWordsConsumptionOfLastMonth(userID) {
      //TO DO
      // we'll need date 1month from now
    }
    static async getWordsConsumptionForMonth(userID, month) {
      //TO DO
    }
    static async returnCompleteUserConsumption(userID) {
      // TO DO
      const resultWordsFromBeginning = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("COUNT", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
        },
      });
      return resultWordsFromBeginning;
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
