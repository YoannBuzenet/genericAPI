const { FREE_LIMIT_NUMBER_OF_WORDS } = require("../config/settings");
const db = require("../models/index");
const utils = require("../services/utils");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/loginAndRegisterIfNeeded",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase", "provider", "user"],
          properties: {
            passphrase: { type: "string" },
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      // This endpoint is coded to work with google auth only for now.
      if (req.body.provider === "google") {
        // Checking for mandatory fields presence for google Auth

        if (
          !utils.propCheckInObject(
            [
              "googleId",
              "fullName",
              "firstName",
              "lastName",
              "avatar",
              "userLocale",
              "accessToken",
              "expiresIn",
            ],
            req.body.user
          )
        ) {
          reply.code(400).send("Missing Parameters in Google Auth.");
          return;
        }

        // Checking if user already exists
        const userToFind = await db.User.findOne({
          where: {
            googleId: req.body.user.googleId,
          },
        });

        let userToReturn;

        if (userToFind !== null) {
          // If user already exists, we just update its token and relevant infos
          const userToUpdate = await db.User.updateTokenFromGoogle(
            userToFind,
            req.body.user
          );
          userToReturn = userToUpdate[0];
        } else {
          // If user doesn't exit in db, we register it
          const userCreated = await db.User.registerFromGoogle(req.body.user);
          userToReturn = userCreated;
        }

        // FREE ACCESS CONTROL
        // Adding number of words if the user is on free access
        if (userToReturn.dataValues.isOnFreeAccess === 1) {
          const totalWordsForThisUser = await db.NumberOfWords.returnCompleteUserConsumption(
            userToReturn.dataValues.id
          );

          userToReturn.dataValues.totalWordsConsumption =
            totalWordsForThisUser[0].dataValues.totalAmount || 0;

          userToReturn.dataValues.userHasStillAccess =
            totalWordsForThisUser[0].dataValues.totalAmount ||
            0 <= FREE_LIMIT_NUMBER_OF_WORDS;
        }

        // MONTHLY CONSUMPTION

        const MonthlyWordsForThisUser = await db.NumberOfWords.getWordsConsumptionForCurrentMonth(
          userToReturn.dataValues.id
        );

        userToReturn.dataValues.monthlyWordsConsumption =
          MonthlyWordsForThisUser[0].dataValues.totalAmount || 0;

        // USER OWN MAX WORDS FOR THIS MONTH
        const baseWordsUser = userToReturn.dataValues.baseMaxWords;
        const allBoostsWordsThisMonthForThisUser = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
          userToReturn.dataValues.id
        );

        let totalMaxWordsUserThisMonth = 0;
        const boostForThisMonth =
          allBoostsWordsThisMonthForThisUser[0].dataValues.totalAmount;
        const intBoost = parseInt(boostForThisMonth, 10);

        if (!isNaN(intBoost)) {
          console.log("here");
          totalMaxWordsUserThisMonth =
            totalMaxWordsUserThisMonth + intBoost + baseWordsUser;
        } else {
          totalMaxWordsUserThisMonth = baseWordsUser;
          console.log("there");
        }

        userToReturn.dataValues.totalMaxWordsUserThisMonth = totalMaxWordsUserThisMonth;
        userToReturn.dataValues.boostThisMonth = boostForThisMonth || 0;

        //Getting user consumption this month

        const currentMonthUTC = utils.getCurrentMonthUTC();
        const totalConsumptionThisMonth = await db.NumberOfWords.getWordsConsumptionForMonth(
          userToFind.dataValues.id,
          currentMonthUTC
        );

        userToFind.dataValues.consumptionThisMonth =
          totalConsumptionThisMonth[0].dataValues.totalAmount;

        // Removing properties we don't want to see on Front-End
        delete userToReturn.dataValues.temporarySecret;
        delete userToReturn.dataValues.temporaryLastProductPaid;
        delete userToReturn.dataValues.nonce;

        // Final Reply
        reply
          .code(200)
          .header("Content-Type", "application/json; charset=utf-8")
          .send(userToReturn);
        return;
      } else {
        reply.code(406).send("Provider not handled.");
        return;
      }
    }
  );

  fastify.post(
    "/EnableFreeAccess",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase", "provider", "user"],
          properties: {
            passphrase: { type: "string" },
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      let idUser;
      let idUserName;
      if (req.body.provider === "google") {
        idUser = req.body.user.googleId;
        idUserName = "googleId";
      }

      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          [idUserName]: idUser,
        },
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
        return;
      }

      if (userToFind.dataValues.hasGottenFreeAccess === 1) {
        reply.code(406).send("User already had free access.");
        return;
      }
      if (userToFind.dataValues.hasSubscribedOnce === 1) {
        reply
          .code(406)
          .send(
            "User subscribed already and does not have access to free access anymore."
          );
        return;
      }
      const userhasNowFreeAccess = await db.User.subscribeFreeAccess(
        userToFind.dataValues.id
      );

      reply
        .code(200)
        .header("Content-Type", "application/json; charset=utf-8")
        .send(userhasNowFreeAccess);
      return;
    }
  );

  // subscription endpoint, can be yearly or monthly
  fastify.post(
    "/subscribe",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase", "provider", "user", "subscription"],
          properties: {
            passphrase: { type: "string" },
            subscription: { type: "string" },
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      let idUser;
      let idUserName;
      if (req.body.provider === "google") {
        idUser = req.body.user.googleId;
        idUserName = "googleId";
      }

      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          [idUser]: idUser,
        },
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
      }

      const wasUserOnFreeAccess = userToFind.dataValues.isOnFreeAccess === 1;

      if (req.body.subscription === "yearly") {
        // 1 year
        const isSubscribedYearly = await db.User.subscribeOneYear(idUser);
      } else if (req.body.subscription === "monthly") {
        // 1 month
        const isSubscribedMonthly = await db.User.subscribeOneMonth(idUser);
      } else {
        reply.code(406).send("Subscription duration not handled.");
      }

      //If user had remaining words on his free access, we add them to his new account
      if (wasUserOnFreeAccess) {
        const result = await db.NumberOfWords.returnCompleteUserConsumption(
          idUser
        );
        const usedWordsForUser = result[0].dataValues.totalAmount;
        const remainingWordsToAdd =
          FREE_LIMIT_NUMBER_OF_WORDS - usedWordsForUser;

        if (remainingWordsToAdd > 0) {
          const addedWords = await db.NumberOfWords.addNumberOfWordsToday(
            idUser,
            remainingWordsToAdd
          );
        }
      }
    }
  );
  // Get by ID
  fastify.post(
    "/getById",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase", "userID"],
          properties: {
            passphrase: { type: "string" },
            userID: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          id: req.body.userID,
        },
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
      }

      // FREE ACCESS CONTROL
      // Adding number of words if the user is on free access
      if (userToFind.dataValues.isOnFreeAccess === 1) {
        const totalWordsForThisUser = await db.NumberOfWords.returnCompleteUserConsumption(
          userToFind.dataValues.id
        );

        userToFind.dataValues.totalWordsConsumption =
          totalWordsForThisUser[0].dataValues.totalAmount || 0;

        userToFind.dataValues.userHasStillAccess =
          totalWordsForThisUser[0].dataValues.totalAmount ||
          0 <= FREE_LIMIT_NUMBER_OF_WORDS;
      }

      // USER OWN MAX WORDS FOR THIS MONTH
      const baseWordsUser = userToFind.dataValues.baseMaxWords;
      const allBoostsWordsThisMonthForThisUser = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
        userToFind.dataValues.id
      );

      let totalMaxWordsUserThisMonth = 0;
      const boostForThisMonth =
        allBoostsWordsThisMonthForThisUser[0].dataValues.totalAmount;
      const intBoost = parseInt(boostForThisMonth, 10);

      if (!isNaN(intBoost)) {
        totalMaxWordsUserThisMonth =
          totalMaxWordsUserThisMonth + intBoost + baseWordsUser;
        userToFind.dataValues.boostThisMonth = intBoost;
      } else {
        totalMaxWordsUserThisMonth = baseWordsUser;
        userToFind.dataValues.boostThisMonth = boostForThisMonth || 0;
      }

      userToFind.dataValues.totalMaxWordsUserThisMonth = totalMaxWordsUserThisMonth;

      //Getting user consumption this month

      const currentMonthUTC = utils.getCurrentMonthUTC();
      const totalConsumptionThisMonth = await db.NumberOfWords.getWordsConsumptionForMonth(
        userToFind.dataValues.id,
        currentMonthUTC
      );

      userToFind.dataValues.consumptionThisMonth =
        totalConsumptionThisMonth[0].dataValues.totalAmount;

      // Removing properties we don't want to see on Front-End
      delete userToFind.dataValues.temporarySecret;
      delete userToFind.dataValues.temporaryLastProductPaid;
      delete userToFind.dataValues.nonce;

      reply.send(userToFind);
      return;
    }
  );

  done();
};
