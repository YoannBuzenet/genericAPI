"use strict";
const { Model } = require("sequelize");
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
      googleId: { type: DataTypes.INTEGER },
      googleAccessToken: { type: DataTypes.STRING(300) },
      googleRefreshToken: { type: DataTypes.STRING(500) },
      accesstokenExpirationDate: { type: DataTypes.STRING },
      avatar: { type: DataTypes.STRING },
      userLocale: { type: DataTypes.STRING },
      isSubscribedUntil: {
        type: DataTypes.DATEONLY,
      },
      temporarySecret: {
        type: DataTypes.STRING,
      },
      temporaryLastProductPaid: {
        type: DataTypes.STRING,
      },
      temporaryChallenge: {
        type: DataTypes.STRING,
      },
      rightsFrontWebApp: { type: DataTypes.INTEGER },
      rightsCentralAPI: { type: DataTypes.INTEGER },
      hasAlreadyConnected: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
