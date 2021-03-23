const db = require("../models/index");
const crypto = require("crypto");
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

      // This endpoint is coded to work with google auth only. If other Oauth2 are added, add check on body prop depending on the provider

      // Hashing directly the access Token
      const hashingAccessToken = crypto
        .createHash("sha256")
        .update(req.body.accessToken)
        .digest("base64");

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
            googleId: req.body.googleId,
          },
        });

        let userToReturn;

        if (userToFind !== null) {
          // Si oui, on maj l'expiration du login/accessToken, puis on le return (avec les datas agrémentées du back)
          // yo
          const userToUpdate = await db.User.updateTokenFromGoogle();
          console.log("creating user");
          userToReturn = { registerAndReturn: false };
        } else {
          console.log("updating user");
          const userCreated = await db.User.registerFromGoogle();
          // Si non, on le register PUIS on le return (avec les datas agrémentées du back)
          userToReturn = { registerAndReturn: true };
        }

        return userToReturn;
      } else {
        reply.code(406).send("Provider not handled.");
        return;
      }
    }
  );

  done();
};
