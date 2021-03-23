"use strict";
const { Model } = require("sequelize");
const crypto = require("crypto");
const utils = require("../services/utils");
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
        googleAccessToken: crypto
          .createHash("sha256")
          .update(user.accessToken)
          .digest("base64"),
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
    static async updateTokenFromGoogle(user) {
      return User.upsert(
        {
          googleAccessToken: crypto
            .createHash("sha256")
            .update(user.accessToken)
            .digest("base64"),
          isLoggedUntil: new Date().addHours(1).toUTCString(),
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
      googleId: { type: DataTypes.STRING },
      googleAccessToken: { type: DataTypes.STRING(300) },
      googleRefreshToken: { type: DataTypes.STRING(500) },
      isLoggedUntil: { type: DataTypes.STRING },
      avatar: { type: DataTypes.STRING },
      userLocale: { type: DataTypes.STRING },
      isSubscribedUntil: {
        type: DataTypes.STRING,
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
