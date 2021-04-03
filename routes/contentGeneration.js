const { generateContent } = require("../controllers/contentGeneration");
const { langReverted } = require("../services/langs");
const db = require("../models/index");
const { checkIfLogged } = require("../services/userCheck");
const { FREE_LIMIT_NUMBER_OF_WORDS } = require("../config/settings");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "category",
            "lang",
            "userInput",
            "passphrase",
            "idUser",
            "provider",
          ],
          properties: {
            category: { type: "integer" },
            lang: { type: "string", minLength: 2 },
            userInput: { type: "array" },
            passphrase: { type: "string", minLength: 5 },
            idUser: { type: "string" },
            provider: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
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

      // STEP 2 : Check User is still subscribed
      // TO DO

      // Checking that user is under free limit if he is on free access
      if (userToCheck.dataValues.isOnFreeAccess === 1) {
        const totalWordsForThisUserThisMonth = await db.NumberOfWords.getWordsConsumptionOfLastMonth(
          userToCheck.dataValues.id
        );

        if (totalWordsForThisUserThisMonth >= FREE_LIMIT_NUMBER_OF_WORDS) {
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
        req.body.numberOfOutputs
      );

      const updatedUser = await db.NumberOfWords.addNumberOfWordsToday(
        userToCheck.dataValues.id,
        aiResponse.numberOfWords
      );

      const totalWordsForThisUserThisMonth = await db.NumberOfWords.getWordsConsumptionOfLastMonth(
        userToCheck.dataValues.id
      );

      return {
        response: aiResponse.apiResp,
        numberOfWordsThisMonth:
          totalWordsForThisUserThisMonth[0].dataValues.totalAmount,
        userCanStillUseService:
          totalWordsForThisUserThisMonth[0].dataValues.totalAmount <=
          FREE_LIMIT_NUMBER_OF_WORDS,
      };
    }
  );

  done();
};
