import db from "../models/index";

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

      // Check si l'user existe en DB avec son ID

      //Si oui, on le return

      // Si non, on le register PUIS on le return
      return { hello: "users" };
    }
  );

  done();
};
