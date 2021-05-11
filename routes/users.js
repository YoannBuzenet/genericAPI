const { FREE_LIMIT_NUMBER_OF_WORDS } = require("../config/settings");
const db = require("../models/index");
const utils = require("../services/utils");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  fastify.post(
    "/login-and-register-if-needed",
    {
      schema: {
        body: {
          type: "object",
          required: ["provider", "user"],
          properties: {
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
      // This endpoint is coded to work with google auth only for now.
      if (req.body.provider === "google") {
        // Checking for mandatory fields presence for google Auth

        // if (
        //   !utils.propCheckInObject(
        //     [
        //       "googleId",
        //       "fullName",
        //       "firstName",
        //       "lastName",
        //       "avatar",
        //       "userLocale",
        //       "accessToken",
        //       "expiresIn",
        //     ],
        //     req.body.user
        //   )
        // ) {
        //   reply.code(400).send("Missing Parameters in Google Auth.");
        //   return;
        // }

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

        // DYNAMIC MONTHLY CONSUMPTION

        const MonthlyWordsForThisUser = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
          userToReturn.dataValues.id,
          userToReturn.dataValues.isSubscribedUntil
        );

        userToReturn.dataValues.consumptionThisMonth = MonthlyWordsForThisUser;

        // CALCULATING NEXT DATE OF SUBSCRIPTION RENEW
        const renewSubscriptionDate = db.User.getNextDateOfRenew(userToReturn);
        userToReturn.dataValues.renewSubscriptionDate = renewSubscriptionDate;

        // USER OWN MAX WORDS FOR THIS MONTH
        const baseWordsUser = userToReturn.dataValues.baseMaxWords;
        const allBoostsWordsThisMonthForThisUser = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
          userToReturn.dataValues.id
        );

        let totalMaxWordsUserThisMonth = 0;
        const boostForThisMonth = allBoostsWordsThisMonthForThisUser;
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
    "/enable-free-access",
    {
      schema: {
        body: {
          type: "object",
          required: ["provider", "user"],
          properties: {
            provider: { type: "string" },
            user: { type: "object" },
          },
        },
      },
    },
    async (req, reply) => {
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

  // Get User by ID
  fastify.get(
    "/:id",
    {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
    async (req, reply) => {
      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          id: req.params.id,
        },
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
        return;
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
          (totalWordsForThisUser[0].dataValues.totalAmount || 0) <=
          FREE_LIMIT_NUMBER_OF_WORDS;
      }

      // USER OWN MAX WORDS FOR THIS MONTH
      const baseWordsUser = userToFind.dataValues.baseMaxWords;
      const allBoostsWordsThisMonthForThisUser = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
        userToFind.dataValues.id
      );

      let totalMaxWordsUserThisMonth = 0;
      const boostForThisMonth = allBoostsWordsThisMonthForThisUser;
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

      //Getting user consumption this dynamic month
      const totalConsumptionThisMonth = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
        userToFind.dataValues.id,
        userToFind.dataValues.isSubscribedUntil
      );

      userToFind.dataValues.consumptionThisMonth = totalConsumptionThisMonth;

      // CALCULATING NEXT DATE OF SUBSCRIPTION RENEW
      const renewSubscriptionDate = db.User.getNextDateOfRenew(userToFind);
      userToFind.dataValues.renewSubscriptionDate = renewSubscriptionDate;

      // Removing properties we don't want to see on Front-End
      delete userToFind.dataValues.temporarySecret;
      delete userToFind.dataValues.temporaryLastProductPaid;
      delete userToFind.dataValues.nonce;

      reply.send(userToFind);
      return;
    }
  );

  // Get User by access Token
  fastify.get(
    "/googleId/:googleId",
    {
      type: "object",
      properties: {
        googleId: { type: "number" },
      },
    },
    async (req, reply) => {
      // Checking if user already exists
      const userToFind = await db.User.findOne({
        where: {
          googleId: req.params.googleId,
        },
      });

      if (userToFind === null) {
        reply.code(406).send("User doesnt exist.");
        return;
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
          (totalWordsForThisUser[0].dataValues.totalAmount || 0) <=
          FREE_LIMIT_NUMBER_OF_WORDS;
      }

      // USER OWN MAX WORDS FOR THIS MONTH
      const baseWordsUser = userToFind.dataValues.baseMaxWords;
      const allBoostsWordsThisMonthForThisUser = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
        userToFind.dataValues.id
      );

      let totalMaxWordsUserThisMonth = 0;
      const boostForThisMonth = allBoostsWordsThisMonthForThisUser;
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

      //Getting user consumption this dynamic month
      const totalConsumptionThisMonth = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
        userToFind.dataValues.id,
        userToFind.dataValues.isSubscribedUntil
      );

      userToFind.dataValues.consumptionThisMonth = totalConsumptionThisMonth;

      // CALCULATING NEXT DATE OF SUBSCRIPTION RENEW
      const renewSubscriptionDate = db.User.getNextDateOfRenew(userToFind);
      userToFind.dataValues.renewSubscriptionDate = renewSubscriptionDate;

      // Removing properties we don't want to see on Front-End
      delete userToFind.dataValues.temporarySecret;
      delete userToFind.dataValues.temporaryLastProductPaid;
      delete userToFind.dataValues.nonce;

      reply.send(userToFind);
      return;
    }
  );

  // Get user Stripe Id thanks to its user id
  fastify.get(
    "/:id/stripeId",
    {
      type: "object",
      properties: {
        id: { type: "number" },
      },
    },
    async (req, reply) => {
      try {
        //get user stripe id in StripePurchase table and send it back
        const result = await db.StripePurchase.findOne({
          where: {
            user_id: {
              type: "object",
              properties: {
                id: { type: "number" },
              },
            },
          },
        });

        const stripeUserId = result.dataValues.customerStripeId;

        reply.code(200).send(stripeUserId);
      } catch (e) {
        console.log("error when getting stripe user id", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Couldn't find stripe user id");
      }
    }
  );

  done();
};
