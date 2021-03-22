const db = require("../models/index");
const crypto = require("crypto");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/loginAndRegisterIfNeeded",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase,accessToken"],
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

      console.log("test", test);

      // Check si l'user existe en DB avec son ID

      //Si oui, on le return

      // Si non, on le register PUIS on le return
      return { hello: "users" };
    }
  );

  done();
};
