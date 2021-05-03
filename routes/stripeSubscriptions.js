const db = require("../models/index");
var Bugsnag = require("@bugsnag/js");
const { sendEmail } = require("../controllers/mailController");
const { langReverted } = require("../services/langs");
const { middlewarePassPhraseCheck } = require("../middlewares/checkPassphrase");

module.exports = function (fastify, opts, done) {
  middlewarePassPhraseCheck(fastify);

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
      try {
        const result = await db.StripePurchase.findOne({
          where: { customerStripeId: req.body.customer_id },
        });

        const user = await db.User.findOne({
          where: {
            id: result.dataValues.user_id,
          },
        });

        if (user === null) {
          reply.code(500).send("Couldn't find user");
          Bugsnag.notify(
            new Error(
              "Subscription Canceled : Couldn't find user in subscription cancelation endpoint"
            )
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

  // User subscription payment failed, we mail him to tell him
  fastify.post(
    "/error",
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
      try {
        const result = await db.StripePurchase.findOne({
          where: { customerStripeId: req.body.customer_id },
        });

        const user = await db.User.findOne({
          where: {
            id: result.dataValues.user_id,
          },
        });

        if (user === null) {
          reply.code(500).send("Couldn't find user");
          Bugsnag.notify(
            new Error(
              "Payment Failed : Couldn't find user in subscription cancelation endpoint"
            )
          );
          return;
        }

        sendEmail(
          "subscription.failed",
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
