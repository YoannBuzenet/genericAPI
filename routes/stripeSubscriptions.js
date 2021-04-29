const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");

module.exports = function (fastify, opts, done) {
  fastify.post(
    "/cancel",
    {
      schema: {
        querystring: {
          required: ["customer_id"],
          properties: {
            customer_id: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      if (req.body.passphrase !== process.env.FRONT_APP_PASSPHRASE) {
        reply.code(406).send("Passphrase doesn't match.");
        return;
      }

      try {
        // TO DO
        // mailing the user
        // get user "real" id, get his mail/locale and mail him

        reply.code(200).send();
      } catch (e) {
        console.log("error mailing the user after canceled subscription", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send("Couldn't mail user");
      }
    }
  );
  done();
};
