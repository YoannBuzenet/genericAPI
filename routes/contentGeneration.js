const { generateContent } = require("../controllers/contentGeneration");
const { langReverted } = require("../services/langs");
const db = require("../models/index");
const { checkIfLogged, isUserSubscribed } = require("../services/userCheck");
const { FREE_LIMIT_NUMBER_OF_WORDS } = require("../config/settings");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: ["category", "lang", "userInput", "idUser", "provider"],
          properties: {
            category: { type: "integer" },
            lang: { type: "string", minLength: 2 },
            userInput: { type: "array" },
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      //Checking user Input
      for (let i = 0; i < req.body.userInput.length; i++) {
        if (req.body.userInput[i].length === 0) {
          reply.code(406).send("Input can't have 0 caracter length.");
          return;
        }
      }

      // USER CHECK
      let idToCheck;
      if (req.body.provider === "google") {
        idToCheck = "googleId";
      } else if (req.body.provider === "website") {
        idToCheck = "id";
      } else {
        reply.code(406).send("Provider not registered.");
        return;
      }

      // Verify that user exists, is logged
      const userToCheck = await db.User.findOne({
        where: { [idToCheck]: req.body.idUser },
      });

      if (userToCheck === null) {
        reply.code(401).send("User doesn't exist.");
        return;
      }
      // Checking user is still logged
      if (!checkIfLogged(userToCheck.dataValues.isLoggedUntil)) {
        reply.code(401).send("User is not logged.");
        return;
      }

      // Checking that user is under free limit if he is on free access
      if (userToCheck.dataValues.isOnFreeAccess === 1) {
        const totalWordsForThisUser = await db.NumberOfWords.returnCompleteUserConsumption(
          userToCheck.dataValues.id
        );

        if (
          totalWordsForThisUser[0].dataValues.totalAmount >=
          FREE_LIMIT_NUMBER_OF_WORDS
        ) {
          reply.code(406).send("Maximum access already reached.");
          return;
        }
      } else {
        const isUserSubbed = isUserSubscribed(
          userToCheck.dataValues.isSubscribedUntil
        );

        // Preparing data to check if user still has words to use
        const userBaseWord = userToCheck.dataValues.baseMaxWords;
        const userBoost = await db.MaxWordsIncrease.getBoostForLast30DaysForThisUser(
          userToCheck.dataValues.id
        );
        const userConsumptionThisPeriod = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
          userToCheck.dataValues.id,
          userToCheck.dataValues.isSubscribedUntil
        );

        const doesUserStillHaveWords =
          userBaseWord + userBoost - userConsumptionThisPeriod > 0;
        if (!isUserSubbed) {
          reply.code(406).send("User is not subscribed and not free access.");
          return;
        } else if (isUserSubbed && !doesUserStillHaveWords) {
          reply.code(406).send("Maximum access already reached.");
          return;
        }
      }

      // Check if category exists
      const categoryIdChecked = await db.Category.findOne({
        where: { id: req.body.category },
      });

      if (categoryIdChecked === null) {
        reply.code(406).send("Category doesn't exist.");
        return;
      }

      if (!Object.keys(langReverted).includes(req.body.lang)) {
        // Check if lang is currently treated by our code
        reply.code(406).send("This lang is not treated currently.");
        return;
      }

      const aiResponse = await generateContent(
        req.body.category,
        req.body.lang,
        req.body.userInput,
        req.body.numberOfOutputs,
        userToCheck
      );

      const updatedUser = await db.NumberOfWords.addNumberOfWordsToday(
        userToCheck.dataValues.id,
        aiResponse.numberOfWordsUsedInResp
      );

      const totalWordsForThisUser = await db.NumberOfWords.returnCompleteUserConsumption(
        userToCheck.dataValues.id
      );

      const MonthlyWordsForThisUser = await db.NumberOfWords.getConsumptionforCurrentDynamicMonthlyPeriod(
        userToCheck.dataValues.id,
        userToCheck.dataValues.isSubscribedUntil
      );

      return {
        response: aiResponse.apiResp,
        wasAllAIOutputFiltered: aiResponse.wasAllInputFiltered,
        numberOfWordsUsedInResp: aiResponse.numberOfWordsUsedInResp,
        numberOfWords: totalWordsForThisUser[0].dataValues.totalAmount,
        userCanStillUseService:
          totalWordsForThisUser[0].dataValues.totalAmount <=
          FREE_LIMIT_NUMBER_OF_WORDS,
        userMonthlyConsumption: MonthlyWordsForThisUser,
      };
    }
  );

  done();
};
