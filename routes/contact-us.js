const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");

module.exports = function (fastify, opts, done) {
  //TODO add middleware that checks passphrase

  fastify.post(
    "/",
    {
      schema: {
        querystring: {
          required: ["fullName", "company", "telephone", "mail", "message"],
          properties: {
            fullName: { type: "string" },
            company: { type: "string" },
            telephone: { type: "string" },
            mail: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    async (req, reply) => {
      try {
        // envoyer le mail
        reply.code(200).send();
      } catch (e) {
        console.log("error when mailing from contact us", e);
        Bugsnag.notify(new Error(e));
        reply.code(500).send();
      }
    }
  );
  done();
};
