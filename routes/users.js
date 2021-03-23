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
          ],
          properties: {
            passphrase: { type: "string" },
            accessToken: { type: "string" },
            expiresIn: { type: "integer" },
            firstName: { type: "string" },
            lastName: { type: "string" },
            avatar: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }
      console.log("on a reçu un call");

      const hashingAccessToken = crypto
        .createHash("sha256")
        .update(req.body.accessToken)
        .digest("base64");

      // Check si l'user existe en DB avec son ID

      // Si oui, on maj l'expiration du login/accessToken, puis on le return (avec les datas agrémentées du back)

      // Si non, on le register PUIS on le return (avec les datas agrémentées du back)
      return { hello: "users" };
    }
  );

  done();
};
