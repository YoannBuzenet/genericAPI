const db = require("../models/index");
const crypto = require("crypto");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/loginAndRegisterIfNeeded",
    {
      schema: {
        body: {
          type: "object",
          required: [
            "passphrase",
            "accessToken",
            "expiresIn",
            "firstName",
            "lastName",
            "avatar",
            "googleId",
          ],
          properties: {
            passphrase: { type: "string" },
            accessToken: { type: "string" },
            expiresIn: { type: "integer" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            avatar: { type: "string" },
            avatar: { type: "googleId" },
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
          googleId: req.body.googleId,
        },
      });

      let userToReturn;

      const hashingAccessToken = crypto
        .createHash("sha256")
        .update(req.body.accessToken)
        .digest("base64");

      if (userToFind !== null) {
        // Si oui, on maj l'expiration du login/accessToken, puis on le return (avec les datas agrémentées du back)
        // yo
        const userCreated = await db.User.registerFromGoogle();

        userToReturn = { registerAndReturn: false };
      } else {
        // Si non, on le register PUIS on le return (avec les datas agrémentées du back)
        userToReturn = { registerAndReturn: true };
      }

      return userToReturn;
    }
  );

  done();
};
