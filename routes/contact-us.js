const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");
const { sendEmail } = require("../controllers/mailController");

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
        const sendingMail = await sendEmail(
          "userContactUsForm",
          "ybuzenet@gmail.com",
          {
            params: {
              fullName: req.body.fullName,
              company: req.body.company,
              telephone: req.body.telephone,
              mail: req.body.mail,
              message: req.body.message,
            },
          },
          "en-US"
        );
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
