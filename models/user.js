"use strict";
const { Model } = require("sequelize");
const hashingFunctions = require("../services/hashingFunctions");

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
      User.hasMany(models.Invoice, { foreignKey: "idShop" });
    }
    static async markAsHasConnected(user) {
      return User.upsert({
        id: user.dataValues.id,
        email: user.dataValues.email,
        shopKey: user.dataValues.shopKey,
        isSubscribedUntil: user.dataValues.isSubscribedUntil,
        temporarySecret: user.dataValues.temporarySecret,
        temporaryLastProductPaid: user.dataValues.temporaryLastProductPaid,
        shouldHaveStockDataRefreshed:
          user.dataValues.shouldHaveStockDataRefreshed,
        hasAlreadyConnected: 1,
      });
    }
    static async registerFromGoogle(user) {
      return User.create({
        email: user.email,
        fullName: user.fullName,
        firstName: user.firstName,
        lastName: user.lastName,
        provider: "google",
        googleId: user.googleId,
        googleAccessToken: hashingFunctions.hashPassword(user.accessToken),
        googleRefreshToken: user.googleRefreshToken,
        isLoggedUntil: new Date().addHours(1).toUTCString(),
        avatar: user.avatar,
        userLocale: user.userLocale,
        isSubscribedUntil: "",
        temporarySecret: "",
        temporaryLastProductPaid: "",
        rightsFrontWebApp: 1,
        rightsCentralAPI: 1,
        hasAlreadyConnected: 0,
        lastConnection: new Date().toUTCString(),
      });
    }
    static async updateTokenFromGoogle(userInDB, userFromGoogle) {
      return User.upsert(
        {
          email: userFromGoogle.email,
          fullName: userFromGoogle.fullName,
          firstName: userFromGoogle.firstName,
          lastName: userFromGoogle.lastName,
          provider: "google",
          googleId: userFromGoogle.googleId,
          googleAccessToken: hashingFunctions.hashPassword(
            userFromGoogle.accessToken
          ),
          googleRefreshToken: userFromGoogle.googleRefreshToken,
          isLoggedUntil: new Date().addHours(1).toUTCString(),
          avatar: userFromGoogle.avatar,
          userLocale: userFromGoogle.userLocale,
          isSubscribedUntil: "",
          temporarySecret: "",
          temporaryLastProductPaid: "",
          rightsFrontWebApp: userInDB.dataValues.rightsFrontWebApp,
          rightsCentralAPI: userInDB.dataValues.rightsCentralAPI,
          hasAlreadyConnected: 0,
          lastConnection: new Date().toUTCString(),
        },
        { fields: ["googleAccessToken", "isLoggedUntil", "lastConnection"] }
      );
    }
  }
  User.init(
    {
      email: {
        allowNull: false,
        type: DataTypes.STRING,
      },
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
        type: DataTypes.STRING,
      },
      isOnFreeAccess: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      companyID: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      temporarySecret: {
        type: DataTypes.STRING,
      },
      temporaryLastProductPaid: {
        type: DataTypes.STRING,
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
