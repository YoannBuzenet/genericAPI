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

        // Removing properties we don't want to see on Front-End
        delete userToReturn.dataValues.temporarySecret;
        delete userToReturn.dataValues.temporaryLastProductPaid;

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

  done();
};
