const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");
const { sendEmail } = require("../controllers/mailController");
const { langReverted } = require("../services/langs");

module.exports = function (fastify, opts, done) {
  // User canceled subscription, we mail him to say goodbye
  fastify.post(
    "/cancel",
    {
      schema: {
        body: {
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
        const result = await db.StripePurchase.findOne({
          where: { customerStripeId: customer_id },
        });

        const user = await db.User.findOne({
          where: {
            id: result.dataValues.user_id,
          },
        });

        if (user === null) {
          reply.code(500).send("Couldn't find user");
          Bugsnag.notify(
            new Error("Couldn't find user in subscription cancelation endpoint")
          );
          return;
        }

        sendEmail(
          "subscription.canceled",
          user.dataValues.email,
          { userFirstName: user.dataValues.firstName },
          langReverted[user.dataValues.userLocale]
        );

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
