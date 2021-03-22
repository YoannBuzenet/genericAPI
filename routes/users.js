const db = require("../models/index");
const crypto = require("crypto");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/getAndRegisterIfNeeded",
    {
      schema: {
        body: {
          type: "object",
          required: ["passphrase"],
          properties: {
            passphrase: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      console.log("on a reçu un call");

      const hashingAccessToken = crypto
        .createHash("sha256")
        .update(req.body.passphrase)
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
