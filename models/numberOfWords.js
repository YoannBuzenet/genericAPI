"use strict";
const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const {
  getNowInUTC,
  getStartOfTheDayInUTC,
  getDays7DaysFromNowInUTC,
  getDate1MonthFromNowInUTC,
  getStartDateMonthInUTC,
  getLastDateOfMonthInUTC,
  getTodayinDATEONLYInUTC,
} = require("../services/utils");

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
      const todayInUTC = getTodayinDATEONLYInUTC();

      const resultWordsToday = await NumberOfWords.findOne({
        where: {
          user_id: userID,
          date: todayInUTC,
        },
      });

      console.log("result of today", resultWordsToday);

      // If it doesnt exist, we create it
      if (resultWordsToday === null) {
        return NumberOfWords.create({
          user_id: userID,
          date: todayInUTC,
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
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gt]: date7DaysFromNow,
            [Op.lt]: nowInUTC,
          },
        },
      });

      // console.log("ok resultWords7Days", resultWords7Days);
      return resultWords7Days;
    }
    static async getWordsConsumptionOfLastMonth(userID) {
      const date1MonthFromNow = getDate1MonthFromNowInUTC();
      const nowInUTC = getNowInUTC();
      const resultWords1Month = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gt]: date1MonthFromNow,
            [Op.lt]: nowInUTC,
          },
        },
      });

      // console.log("ok resultWords1Month", resultWords1Month);
      return resultWords1Month;
    }
    static async getWordsConsumptionForMonth(userID, month) {
      const monthBeginning = getStartDateMonthInUTC(month);
      const monthEnd = getLastDateOfMonthInUTC(month);
      const resultWordsFromThisMonth = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gt]: monthBeginning,
            [Op.lt]: monthEnd,
          },
        },
      });

      // console.log("ok resultWordsFromThisMonth", resultWordsFromThisMonth);

      return resultWordsFromThisMonth;
    }
    static async returnCompleteUserConsumption(userID) {
      const resultWordsFromBeginning = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
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
