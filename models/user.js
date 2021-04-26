"use strict";
const { Model } = require("sequelize");
const hashingFunctions = require("../services/hashingFunctions");
const utils = require("../services/utils");
const crypto = require("crypto");
const { MAX_WORD_SUBSCRIBE } = require("../Definitions/constants");

// Specific function definition to handle UTC more easily
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + h * 60 * 60 * 1000);
  return this;
};

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order, { foreignKey: "idShop" });
      User.hasMany(models.NumberOfWords, { foreignKey: "user_id" });
      User.hasMany(models.FilteredOpenAIInput, { foreignKey: "user_id" });
      User.hasMany(models.Invoice, { foreignKey: "idShop" });
      User.hasMany(models.TokenConsumption, { foreignKey: "userID" });
      User.hasMany(models.MaxWordsIncrease, { foreignKey: "user_id" });
      User.hasMany(models.CallToService, { foreignKey: "user_id" });
      User.belongsTo(models.Company, { foreignKey: "companyID" });
    }
    // static async markAsHasConnected(user) {
    //   return User.upsert({
    //     id: user.dataValues.id,
    //     email: user.dataValues.email,
    //     shopKey: user.dataValues.shopKey,
    //     isSubscribedUntil: user.dataValues.isSubscribedUntil,
    //     temporarySecret: user.dataValues.temporarySecret,
    //     temporaryLastProductPaid: user.dataValues.temporaryLastProductPaid,
    //     shouldHaveStockDataRefreshed:
    //       user.dataValues.shouldHaveStockDataRefreshed,
    //     hasAlreadyConnected: 1,
    //   });
    // }
    static async registerFromGoogle(user) {
      let nonce = crypto.randomBytes(16).toString("base64");

      return User.create({
        email: user.email,
        nonce: nonce,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: "google",
        googleId: user.googleId,
        googleAccessToken: hashingFunctions.hashPassword(user.accessToken),
        googleRefreshToken: user.refreshToken,
        isLoggedUntil: new Date().addHours(1).toUTCString(),
        isOnCompanyAccess: user.isOnCompanyAccess,
        companyID: 0,
        avatar: user.avatar,
        userLocale: user.userLocale,
        isSubscribedUntil: null,
        baseMaxWords: MAX_WORD_SUBSCRIBE,
        temporarySecret: "",
        temporaryLastProductPaid: "",
        rightsFrontWebApp: 1,
        rightsCentralAPI: 1,
        hasAlreadyConnected: 0,
        lastConnection: new Date().toUTCString(),
      });
    }
    static async updateTokenFromGoogle(userInDB, userFromGoogle) {
      const refreshToken = userFromGoogle.hasOwnProperty("refreshToken")
        ? userFromGoogle.refreshToken
        : userInDB.googleRefreshToken;

      return User.upsert(
        {
          email: userFromGoogle.email,
          nonce: userInDB.nonce,
          fullName: userFromGoogle.fullName,
          firstName: userFromGoogle.firstName,
          lastName: userFromGoogle.lastName,
          provider: "google",
          googleId: userFromGoogle.googleId,
          googleAccessToken: hashingFunctions.hashPassword(
            userFromGoogle.accessToken
          ),
          googleRefreshToken: userFromGoogle.refreshToken,
          companyID: userInDB.dataValues.companyID,
          isOnCompanyAccess: userInDB.dataValues.isOnCompanyAccess,
          hasGottenFreeAccess: userInDB.dataValues.hasGottenFreeAccess,
          hasSubscribedOnce: userInDB.dataValues.hasSubscribedOnce,
          isLoggedUntil: new Date().addHours(1).toUTCString(),
          avatar: userFromGoogle.avatar,
          userLocale: userFromGoogle.userLocale,
          isSubscribedUntil: userInDB.dataValues.isSubscribedUntil,
          baseMaxWords: userInDB.dataValues.baseMaxWords,
          temporarySecret: "",
          temporaryLastProductPaid: "",
          rightsFrontWebApp: userInDB.dataValues.rightsFrontWebApp,
          rightsCentralAPI: userInDB.dataValues.rightsCentralAPI,
          hasAlreadyConnected: 0,
          lastConnection: new Date().toUTCString(),
        },
        {
          fields: [
            "googleAccessToken",
            "googleRefreshToken",
            "isLoggedUntil",
            "lastConnection",
          ],
        }
      );
    }
    static async subscribeFreeAccess(userID) {
      const user = await User.findOne({ where: { id: userID } });
      user.isOnFreeAccess = 1;
      user.hasGottenFreeAccess = 1;
      return user.save();
    }
    static async subscribeOneMonth(userID) {
      const user = await User.findOne({ where: { id: userID } });
      user.isSubscribedUntil = utils.getOneMonthFutureFromNowUTC();
      user.hasSubscribedOnce = 1;
      user.isOnFreeAccess = 0;
      return user.save();
    }
    static async subscribeOneYear(userID) {
      const user = await User.findOne({ where: { id: userID } });
      user.isSubscribedUntil = utils.get12MonthsFutureFromNowUTC();
      user.hasSubscribedOnce = 1;
      user.isOnFreeAccess = 0;
      return user.save();
    }
    static async subscribeCompanyAccess(userID, companyID) {
      const user = await User.findOne({ where: { id: userID } });
      user.isSubscribedUntil = utils.get1200MonthsFutureFromNowUTC();
      user.isOnFreeAccess = 0;
      user.hasSubscribedOnce = 1;
      user.companyID = companyID;
      user.isOnCompanyAccess = 1;

      return user.save();
    }

    static getNextDateOfRenew(userObject) {
      if (
        userObject === null ||
        userObject.dataValues.isSubscribedUntil === null
      ) {
        return null;
      }

      const dayOfRenewalSubscription = new Date(
        userObject.dataValues.isSubscribedUntil
      ).getUTCDate();

      // Building the next date of renew
      const todayNumberOftTheDayUTC = new Date().getUTCDate();
      let monthOfNextRenew;

      // If today is below the renew date, we must check last month to get the next renew
      if (todayNumberOftTheDayUTC > dayOfRenewalSubscription) {
        monthOfNextRenew = new Date().getUTCMonth() + 1;
      } else {
        monthOfNextRenew = new Date().getUTCMonth();
      }

      const date = new Date();
      const nextRenewDate = Date.UTC(
        date.getUTCFullYear(),
        monthOfNextRenew,
        dayOfRenewalSubscription,
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds()
      );

      return nextRenewDate;
    }
  }
  User.init(
    {
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      nonce: { type: DataTypes.STRING, allowNull: false },
      fullName: { type: DataTypes.STRING },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      provider: { type: DataTypes.STRING },
      googleId: { type: DataTypes.STRING, unique: true },
      googleAccessToken: { type: DataTypes.STRING(300) },
      googleRefreshToken: { type: DataTypes.STRING(500) },
      isLoggedUntil: { type: DataTypes.STRING },
      avatar: { type: DataTypes.STRING },
      userLocale: { type: DataTypes.STRING },
      isSubscribedUntil: {
        type: DataTypes.DATEONLY,
      },
      isOnFreeAccess: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Value of isOnFreeAccess prop must be 0 or 1 integer.",
          },
        },
      },
      hasGottenFreeAccess: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Value of hasGottenFreeAccess prop must be 0 or 1 integer.",
          },
        },
      },
      hasSubscribedOnce: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Value of hasSubscribedOnce prop must be 0 or 1 integer.",
          },
        },
      },
      isOnCompanyAccess: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        validate: {
          isIn: {
            args: [[0, 1]],
            msg: "Value of isOnCompanyAccess prop must be 0 or 1 integer.",
          },
        },
      },
      companyID: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      temporarySecret: {
        type: DataTypes.STRING,
      },
      temporaryLastProductPaid: {
        type: DataTypes.STRING,
      },
      baseMaxWords: {
        type: DataTypes.INTEGER,
        defaultValue: 20000,
      },
      rightsFrontWebApp: { type: DataTypes.INTEGER },
      rightsCentralAPI: { type: DataTypes.INTEGER },
      hasAlreadyConnected: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      lastConnection: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
