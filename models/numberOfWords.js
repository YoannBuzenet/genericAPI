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

      // console.log("result of today", resultWordsToday);

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
            [Op.gte]: date7DaysFromNow,
          },
        },
      });

      // console.log("ok resultWords7Days", resultWords7Days);
      return resultWords7Days;
    }

    static async getAllDataFor7lastDays(userID) {
      const date7DaysFromNow = getDays7DaysFromNowInUTC();

      const resultWords7Days = await NumberOfWords.findAll({
        where: {
          user_id: userID,
          date: {
            [Op.gte]: date7DaysFromNow,
          },
        },
        order: [["date", "ASC"]],
      });
      return resultWords7Days;
    }
    static async getWordsConsumptionOf30days(userID) {
      const date1MonthFromNow = getDate1MonthFromNowInUTC();
      const nowInUTC = getNowInUTC();
      const resultWords1Month = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gte]: date1MonthFromNow,
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
            [Op.gte]: monthBeginning,
            [Op.lte]: monthEnd,
          },
        },
      });

      // console.log("ok resultWordsFromThisMonth", resultWordsFromThisMonth);

      return resultWordsFromThisMonth;
    }

    static async getWordsConsumptionForCurrentMonth(userID) {
      var date = new Date();
      const monthBeginning = getStartDateMonthInUTC(date.getUTCMonth());
      const resultWordsFromThisMonth = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gte]: monthBeginning,
          },
        },
      });

      // console.log("ok resultWordsFromThisMonth", resultWordsFromThisMonth);

      return resultWordsFromThisMonth;
    }

    // This function calculates user consumption on the dynamuc user month (not the real current month but the period he chose, that is likely to be splitted on 2 months)
    // As the user can subscribe at any day of the month, we must calculate first
    // - when does it renew
    // - then substract consumption between today and last renew period to have final count
    static async getConsumptionforCurrentDynamicMonthlyPeriod(
      user_id,
      userIsSubscribedUntil
    ) {
      if (userIsSubscribedUntil === null) {
        return 0;
      }

      const dayOfRenewalSubscription = new Date(
        userIsSubscribedUntil
      ).getUTCDate();

      // Building the last date of renew
      const todayNumberOftTheDayUTC = new Date().getUTCDate();
      let monthOfLastRenew;

      // If today is below the renew date, we must check last month to get the last renew that happened
      if (dayOfRenewalSubscription > todayNumberOftTheDayUTC) {
        monthOfLastRenew = new Date().getUTCMonth() - 1;
      } else {
        monthOfLastRenew = new Date().getUTCMonth();
      }

      const date = new Date();
      const lastRenewDate = Date.UTC(
        date.getUTCFullYear(),
        monthOfLastRenew,
        dayOfRenewalSubscription,
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );

      const resultWordsFromThisUserPeriod = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: user_id,
          date: {
            [Op.gte]: lastRenewDate,
          },
        },
      });

      if (
        isNaN(
          parseInt(resultWordsFromThisUserPeriod?.[0]?.dataValues?.totalAmount)
        )
      ) {
        return 0;
      }
      return resultWordsFromThisUserPeriod?.[0]?.dataValues?.totalAmount;
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
        type: DataTypes.INTEGER,
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
