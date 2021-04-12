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
  class MaxWordsIncrease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MaxWordsIncrease.belongsTo(models.User, { foreignKey: "user_id" });
    }

    static async getBoostForThisMonthForThisUser(userID) {
      const startOfMonthUTC = getStartDateMonthInUTC();
      const nowInUTC = getNowInUTC();

      const resultBoostThisMonth = await NumberOfWords.findAll({
        attributes: [
          [sequelize.fn("sum", sequelize.col("amount")), "totalAmount"],
        ],
        where: {
          user_id: userID,
          date: {
            [Op.gt]: startOfMonthUTC,
          },
        },
      });

      // console.log("ok resultWords7Days", resultWords7Days);
      return resultBoostThisMonth;
    }
  }
  MaxWordsIncrease.init(
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
      modelName: "MaxWordsIncrease",
    }
  );
  return MaxWordsIncrease;
};
